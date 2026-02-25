from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from datetime import datetime

from models.tender import Tender
from schemas.tender import TenderCreateRequest, TenderUpdateRequest


class TenderService:
    @staticmethod
    async def get_tenders_paginated(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 10,
        status_filter: str | None = None,
        created_by_id: int | None = None
    ) -> tuple[list[Tender], int]:
        """
        Get paginated list of tenders with optional filters
        Returns: (tenders, total_count)
        """
        # Pagination safety
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)
        
        offset = (page - 1) * page_size
        
        # Build query with filters
        query = select(Tender)
        count_query = select(func.count()).select_from(Tender)
        
        if status_filter:
            query = query.where(Tender.status == status_filter)
            count_query = count_query.where(Tender.status == status_filter)
        
        if created_by_id:
            query = query.where(Tender.created_by_id == created_by_id)
            count_query = count_query.where(Tender.created_by_id == created_by_id)
        
        # Apply pagination
        query = query.offset(offset).limit(page_size).order_by(Tender.created_at.desc())
        
        # Execute queries
        result = await db.execute(query)
        tenders = list(result.scalars().all())
        
        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar_one()
        
        return tenders, total_count
    
    @staticmethod
    async def get_tender_by_id(
        db: AsyncSession,
        tender_id: int
    ) -> Tender:
        """Get a tender by ID"""
        result = await db.execute(
            select(Tender).where(Tender.id == tender_id)
        )
        tender = result.scalars().first()
        
        if not tender:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tender with id {tender_id} not found"
            )
        
        return tender
    
    @staticmethod
    async def create_tender(
        db: AsyncSession,
        data: TenderCreateRequest,
        created_by_id: int | None = None
    ) -> Tender:
        """Create a new tender"""
        # Validate dates
        if data.contract_start_date >= data.contract_end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contract end date must be after start date"
            )
        
        if data.min_budget >= data.max_budget:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Max budget must be greater than min budget"
            )
        
        # Create tender
        tender = Tender(
            title=data.title,
            description=data.description,
            service_type=data.service_type,
            custom_service_type=data.custom_service_type,
            property_name=data.property_name,
            property_address_line_1=data.property_address_line_1,
            property_address_line_2=data.property_address_line_2,
            property_city=data.property_city,
            property_state=data.property_state,
            property_postcode=data.property_postcode,
            property_country=data.property_country,
            scope_of_work=data.scope_of_work,
            contract_period_days=data.contract_period_days,
            contract_start_date=data.contract_start_date,
            contract_end_date=data.contract_end_date,
            required_licenses=data.required_licenses,
            custom_licenses=data.custom_licenses,
            evaluation_criteria=[criterion.model_dump() for criterion in data.evaluation_criteria],
            tender_fee=data.tender_fee,
            min_budget=data.min_budget,
            max_budget=data.max_budget,
            closing_date=data.closing_date,
            closing_time=data.closing_time,
            site_visit_date=data.site_visit_date,
            site_visit_time=data.site_visit_time,
            contact_person=data.contact_person,
            contact_email=data.contact_email,
            contact_phone=data.contact_phone,
            tender_documents=data.tender_documents,
            status=data.status,
            created_by_id=created_by_id
        )
        
        db.add(tender)
        await db.commit()
        await db.refresh(tender)
        
        return tender
    
    @staticmethod
    async def update_tender(
        db: AsyncSession,
        tender_id: int,
        data: TenderUpdateRequest,
        user_id: int | None = None
    ) -> Tender:
        """Update a tender"""
        tender = await TenderService.get_tender_by_id(db, tender_id)
        
        # Authorization check (optional - add if needed)
        if user_id and tender.created_by_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this tender"
            )
        
        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        
        # Handle evaluation_criteria conversion
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
        
        return tender
    
    @staticmethod
    async def delete_tender(
        db: AsyncSession,
        tender_id: int,
        user_id: int | None = None
    ) -> None:
        """Delete a tender"""
        tender = await TenderService.get_tender_by_id(db, tender_id)
        
        # Authorization check
        if user_id and tender.created_by_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this tender"
            )
        
        await db.delete(tender)
        await db.commit()
