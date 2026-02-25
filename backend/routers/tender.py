from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from database import get_db
from core.security import get_current_user
from models.user import User
from schemas.tender import (
    TenderResponse,
    TenderCreateRequest,
    TenderUpdateRequest,
    TenderListResponse,
    TenderStatus
)
from services.tender_service import TenderService

router = APIRouter()


@router.get("/", response_model=TenderListResponse)
async def get_tenders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: Optional[TenderStatus] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of tenders with optional status filter"""
    tenders, total_count = await TenderService.get_tenders_paginated(
        db=db,
        page=page,
        page_size=page_size,
        status_filter=status
    )
    
    return TenderListResponse(
        tenders=[TenderResponse.model_validate(t) for t in tenders],
        total=total_count,
        page=page,
        page_size=page_size
    )


@router.get("/{tender_id}", response_model=TenderResponse)
async def get_tender(
    tender_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a tender by ID"""
    tender = await TenderService.get_tender_by_id(db, tender_id)
    return TenderResponse.model_validate(tender)


@router.post("/create", response_model=TenderResponse, status_code=status.HTTP_201_CREATED)
async def create_tender(
    tender_data: TenderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new tender (requires authentication)"""
    tender = await TenderService.create_tender(
        db=db,
        data=tender_data,
        created_by_id=current_user.id
    )
    return TenderResponse.model_validate(tender)


@router.patch("/{tender_id}", response_model=TenderResponse)
async def update_tender(
    tender_id: int,
    tender_data: TenderUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a tender (requires authentication and authorization)"""
    tender = await TenderService.update_tender(
        db=db,
        tender_id=tender_id,
        data=tender_data,
        user_id=current_user.id
    )
    return TenderResponse.model_validate(tender)


@router.delete("/{tender_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tender(
    tender_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a tender (requires authentication and authorization)"""
    await TenderService.delete_tender(
        db=db,
        tender_id=tender_id,
        user_id=current_user.id
    )
    return None


@router.get("/my/tenders", response_model=TenderListResponse)
async def get_my_tenders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get tenders created by current user"""
    tenders, total_count = await TenderService.get_tenders_paginated(
        db=db,
        page=page,
        page_size=page_size,
        created_by_id=current_user.id
    )
    
    return TenderListResponse(
        tenders=[TenderResponse.model_validate(t) for t in tenders],
        total=total_count,
        page=page,
        page_size=page_size
    )
