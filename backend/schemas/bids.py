from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from typing import Optional, List
from pydantic import ConfigDict
from datetime import datetime

class BidStatus(str, Enum):
    SUBMITTED = "submitted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    AWARDED = "awarded"

class BidBase(BaseModel):
    # Company & Contact
    company_name: str
    company_registration: str
    company_address: str
    company_website: Optional[str] = None
    contact_person_name: str
    contact_person_phone: str
    contact_person_email: EmailStr

    # Financial Proposal
    proposed_amount: float = Field(..., gt=0)
    include_sst: bool = False
    payment_terms: str = "30 Days"
    validity_period_days: int

    # Technical Proposal
    supporting_documents: Optional[list[str]] = None
    methodology: Optional[str] = None
    proposed_timeline: Optional[str] = None
    agree_to_terms: bool

class BidCreateRequest(BidBase):
    tender_id: int

class BidUpdateRequest(BidBase):
    company_name: Optional[str] = None
    company_registration: Optional[str] = None
    company_address: Optional[str] = None
    company_website: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_person_phone: Optional[str] = None
    contact_person_email: Optional[EmailStr] = None
    proposed_amount: Optional[float] = None
    include_sst: Optional[bool] = None
    payment_terms: Optional[str] = None
    validity_period_days: Optional[int] = None
    supporting_documents: Optional[list[str]] = None
    methodology: Optional[str] = None
    proposed_timeline: Optional[str] = None
    agree_to_terms: Optional[bool] = None
    status: Optional[BidStatus] = None

class BidResponse(BidBase):
    id: int
    tender_id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    status: BidStatus
    tender_title: str

    model_config = ConfigDict(from_attributes=True)

class BidListResponse(BaseModel):
    bids: List[BidResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)