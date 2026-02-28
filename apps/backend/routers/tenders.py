from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import datetime, date
from database import get_db
from core.security import get_current_user_optional, get_tender_visibility_filter, require_role
from core.pagination import normalize_pagination_params, paginate_query
from models.users import User
from models.tenders import Tender
from models.bids import Bid
from schemas.tenders import (
    TenderResponse,
    TenderCreateRequest,
    TenderUpdateRequest,
    TenderListResponse,
    TenderStatus
)

router = APIRouter()

@router.get("/", response_model=TenderListResponse)
async def get_tenders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: Optional[TenderStatus] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    page, page_size, offset = normalize_pagination_params(page, page_size)
    
    # Build query with role-based visibility
    query = select(Tender).order_by(Tender.created_at.desc())
    count_query = select(func.count()).select_from(Tender)
    
    # Apply visibility filter based on user role
    visibility = get_tender_visibility_filter(current_user, Tender)
    if visibility is not None:
        query = query.where(visibility)
        count_query = count_query.where(visibility)

    # Apply optional status filter
    if status:
        query = query.where(Tender.status == status)
        count_query = count_query.where(Tender.status == status)
    
    # Apply pagination and execute
    query = query.offset(offset).limit(page_size)
    tenders, total_count, total_pages = await paginate_query(db, query, count_query, page, page_size)
    
    return TenderListResponse(
        tenders=[TenderResponse.model_validate(t) for t in tenders],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{tender_id}", response_model=TenderResponse)
async def get_tender(
    tender_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    query = select(Tender).where(Tender.id == tender_id)
    
    visibility = get_tender_visibility_filter(current_user, Tender)
    if visibility is not None:
        query = query.where(visibility)
    
    result = await db.execute(query)
    tender = result.scalars().first()
    
    if not tender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tender not found")
    
    # Calculate bid statistics if user is owner or admin
    tender_response = TenderResponse.model_validate(tender)
    
    if current_user and (current_user.role == "admin" or tender.created_by_id == current_user.id):
        # Get bid statistics
        bid_stats = await db.execute(
            select(
                func.count(Bid.id).label("total"),
                func.min(Bid.proposed_amount).label("lowest"),
                func.max(Bid.proposed_amount).label("highest"),
                func.avg(Bid.proposed_amount).label("average")
            ).where(Bid.tender_id == tender_id)
        )
        stats = bid_stats.first()
        
        if stats and stats.total > 0:
            tender_response.total_bids = stats.total
            tender_response.lowest_bid = float(stats.lowest) if stats.lowest else None
            tender_response.highest_bid = float(stats.highest) if stats.highest else None
            tender_response.average_bid = float(stats.average) if stats.average else None
        else:
            tender_response.total_bids = 0
    
    return tender_response



@router.post("/create", response_model=TenderResponse, status_code=status.HTTP_201_CREATED)
async def create_tender(
    tender_data: TenderCreateRequest,
    current_user: User = Depends(require_role(["JMB", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    if tender_data.contract_start_date >= tender_data.contract_end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contract end date must be after start date")
    
    if tender_data.min_budget >= tender_data.max_budget:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Max budget must be greater than min budget")
    
    if tender_data.closing_date < date.today():
        raise HTTPException(status_code=400, detail="Tender closing date must be in the future")
    
    # Create tender using model_dump() to unpack all fields
    tender_dict = tender_data.model_dump()
    tender_dict['evaluation_criteria'] = [
        criterion.model_dump() for criterion in tender_data.evaluation_criteria
    ]
    tender_dict['created_by_id'] = current_user.id
    
    tender = Tender(**tender_dict)
    db.add(tender)
    await db.commit()
    await db.refresh(tender)
    
    return TenderResponse.model_validate(tender)



@router.patch("/{tender_id}", response_model=TenderResponse)
async def update_tender(
    tender_id: int,
    tender_data: TenderUpdateRequest,
    current_user: User = Depends(require_role(["JMB", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalars().first()
    
    if not tender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tender with id {tender_id} not found")
    
    # Check authorization
    is_admin = current_user.role == "admin"
    if tender.created_by_id != current_user.id and not is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this tender")
    
    if tender.status in [TenderStatus.CLOSED, TenderStatus.AWARDED, TenderStatus.CANCELLED] and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot update a tender that is closed, awarded, or cancelled")

    update_data = tender_data.model_dump(exclude_unset=True)

    if "closing_date" in update_data:
        if update_data["closing_date"] < date.today() and not is_admin:
            raise HTTPException(status_code=400, detail="Closing date cannot be set in the past")
        
    new_start = update_data.get("contract_start_date", tender.contract_start_date)
    new_end = update_data.get("contract_end_date", tender.contract_end_date)
    if new_start >= new_end:
        raise HTTPException(status_code=400, detail="Contract end date must be after start date")
    
    if 'evaluation_criteria' in update_data and update_data['evaluation_criteria']:
        update_data['evaluation_criteria'] = [
            criterion.model_dump() if hasattr(criterion, 'model_dump') else criterion
            for criterion in update_data['evaluation_criteria']
        ]
    
    for key, value in update_data.items():
        setattr(tender, key, value)
    
    tender.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(tender)
    
    return TenderResponse.model_validate(tender)



@router.delete("/{tender_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tender(
    tender_id: int,
    current_user: User = Depends(require_role(["JMB", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalars().first()
    
    if not tender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tender with id {tender_id} not found")
    
    if current_user.role == "admin":
        await db.delete(tender)
        await db.commit()
        return None

    # For JMBs
    if tender.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # if tender.status != TenderStatus.DRAFT:
    #     raise HTTPException(
    #         status_code=400, 
    #         detail="You cannot delete a tender that has been published. Please mark it as Cancelled instead."
    #     )
    
    await db.delete(tender)
    await db.commit()
    
    return None



@router.get("/my/tenders", response_model=TenderListResponse)
async def get_my_tenders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_role(["JMB", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    page, page_size, offset = normalize_pagination_params(page, page_size)
    
    # Build query with user filter
    query = select(Tender).where(Tender.created_by_id == current_user.id).order_by(Tender.created_at.desc())
    count_query = select(func.count()).select_from(Tender).where(Tender.created_by_id == current_user.id)
    
    # Apply pagination and execute
    query = query.offset(offset).limit(page_size)
    tenders, total_count, total_pages = await paginate_query(db, query, count_query, page, page_size)
    
    return TenderListResponse(
        tenders=[TenderResponse.model_validate(t) for t in tenders],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
