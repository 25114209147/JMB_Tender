from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from typing import Optional
from datetime import datetime

from database import get_db
from core.security import get_current_user, require_role, apply_bid_visibility_filter
from core.pagination import normalize_pagination_params, paginate_query
from models.users import User
from models.bids import Bid, BidStatus
from models.tenders import Tender, TenderStatus
from schemas.bids import (
    BidResponse,
    BidCreateRequest,
    BidUpdateRequest,
    BidListResponse
)

router = APIRouter()


@router.get("/", response_model=BidListResponse)
async def get_bids(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    tender_id: Optional[int] = None,
    status: Optional[BidStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    page, page_size, offset = normalize_pagination_params(page, page_size)
    
    query = select(Bid).order_by(Bid.created_at.desc())
    count_query = select(func.count()).select_from(Bid)
    
    query, count_query = apply_bid_visibility_filter(query, count_query, current_user, Bid, Tender)
    
    if tender_id:
        query = query.where(Bid.tender_id == tender_id)
        count_query = count_query.where(Bid.tender_id == tender_id)
    
    if status:
        query = query.where(Bid.status == status)
        count_query = count_query.where(Bid.status == status)
    
    query = query.options(joinedload(Bid.tender)).offset(offset).limit(page_size)
    bids, total_count, total_pages = await paginate_query(db, query, count_query, page, page_size)
    
    return BidListResponse(
        bids=[BidResponse.model_validate(b) for b in bids],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{bid_id}", response_model=BidResponse)
async def get_bid(
    bid_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Bid).where(Bid.id == bid_id))
    bid = result.scalars().first()
    
    if not bid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bid with id {bid_id} not found"
        )
    
    if current_user.role == "contractor" and bid.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid not found")
    elif current_user.role == "JMB":
        if bid.tender.created_by_id != current_user.id and bid.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid not found")
    
    return BidResponse.model_validate(bid)



@router.post("/create", response_model=BidResponse, status_code=status.HTTP_201_CREATED)
async def create_bid(
    bid_data: BidCreateRequest,
    current_user: User = Depends(require_role(["contractor"])),  
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tender).where(Tender.id == bid_data.tender_id))
    tender = result.scalars().first()
    
    if not tender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tender with id {bid_data.tender_id} not found"
        )
    
    if tender.status != TenderStatus.OPEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit bid to a tender that is not open"
        )
    
    # Check if tender has closed
    if tender.closing_date < datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tender has already closed"
        )
    
    # Check if user already submitted a bid for this tender
    existing_bid_result = await db.execute(
        select(Bid).where(
            Bid.tender_id == bid_data.tender_id,
            Bid.user_id == current_user.id,
            Bid.status.in_([BidStatus.SUBMITTED, BidStatus.AWARDED])
        )
    )
    existing_bid = existing_bid_result.scalars().first()
    
    if existing_bid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a bid for this tender"
        )
    
    if not bid_data.agree_to_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must agree to terms and conditions"
        )
    
    bid_dict = bid_data.model_dump()
    bid_dict['user_id'] = current_user.id
    bid_dict['status'] = BidStatus.SUBMITTED
    
    bid = Bid(**bid_dict)
    db.add(bid)
    await db.commit()
    await db.refresh(bid)
    
    return BidResponse.model_validate(bid)



@router.patch("/{bid_id}", response_model=BidResponse)
async def update_bid(
    bid_id: int,
    bid_data: BidUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Bid).where(Bid.id == bid_id))
    bid = result.scalars().first()
    
    if not bid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bid with id {bid_id} not found")
    
    is_bid_JMB = bid.user_id == current_user.id
    is_tender_JMB = bid.tender.created_by_id == current_user.id
    is_admin = current_user.role == "admin"
    
    if not (is_bid_JMB or is_tender_JMB or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this bid")
    
    update_data = bid_data.model_dump(exclude_unset=True)
    
    if "status" in update_data:
        if not (is_tender_JMB or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tender JMB or admin can change bid status"
            )
        if bid.status == BidStatus.AWARDED and update_data["status"] != BidStatus.AWARDED and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change status of awarded bid"
            )
    else:
        if not (is_bid_JMB or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only bid JMB can update bid content"
            )
        
        if bid.status != BidStatus.SUBMITTED and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update bid that is not in submitted status"
            )
        
        if "proposed_amount" in update_data:
            if update_data["proposed_amount"] < bid.tender.min_budget or update_data["proposed_amount"] > bid.tender.max_budget:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Proposed amount must be between {bid.tender.min_budget} and {bid.tender.max_budget}"
                )
    
    for key, value in update_data.items():
        setattr(bid, key, value)
    
    bid.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(bid)
    
    return BidResponse.model_validate(bid)



@router.delete("/{bid_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bid(
    bid_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Bid).where(Bid.id == bid_id))
    bid = result.scalars().first()
    
    if not bid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bid with id {bid_id} not found")
    
    is_admin = current_user.role == "admin"
    
    if is_admin:
        await db.delete(bid)
        await db.commit()
        return None
    
    if bid.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if bid.status == BidStatus.AWARDED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete awarded bid. Contact admin if needed."
        )
    
    if bid.status == BidStatus.SUBMITTED:
        bid.status = BidStatus.WITHDRAWN
        bid.updated_at = datetime.utcnow()
        await db.commit()
        return None
    
    await db.delete(bid)
    await db.commit()
    
    return None



@router.get("/my/bids", response_model=BidListResponse)
async def get_my_bids(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_role(["contractor"])),  # Only contractors have bids
    db: AsyncSession = Depends(get_db)
):
    page, page_size, offset = normalize_pagination_params(page, page_size)
    
    query = select(Bid).where(Bid.user_id == current_user.id).order_by(Bid.created_at.desc())
    count_query = select(func.count()).select_from(Bid).where(Bid.user_id == current_user.id)
    
    query = query.offset(offset).limit(page_size)
    bids, total_count, total_pages = await paginate_query(db, query, count_query, page, page_size)
    
    return BidListResponse(
        bids=[BidResponse.model_validate(b) for b in bids],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )



@router.get("/tender/{tender_id}/bids", response_model=BidListResponse)
async def get_tender_bids(
    tender_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_role(["JMB", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalars().first()
    
    if not tender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tender with id {tender_id} not found"
        )
    
    if current_user.role == "JMB" and tender.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view bids for this tender"
        )
    
    page, page_size, offset = normalize_pagination_params(page, page_size)
    
    query = select(Bid).where(Bid.tender_id == tender_id).order_by(Bid.created_at.desc())
    count_query = select(func.count()).select_from(Bid).where(Bid.tender_id == tender_id)
    
    query = query.offset(offset).limit(page_size)
    bids, total_count, total_pages = await paginate_query(db, query, count_query, page, page_size)
    
    return BidListResponse(
        bids=[BidResponse.model_validate(b) for b in bids],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )