from typing import Optional, List
import enum
from datetime import date, time, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class TenderStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    CANCELLED = "cancelled"
    AWARDED = "awarded"

class EvaluationCriteria(BaseModel):
    criteria: str
    weight: float

class TenderBase(BaseModel):
    title: str  
    description: Optional[str] = None
    service_type: str
    custom_service_type: Optional[str] = None
    property_name: str
    property_address_line_1: str
    property_address_line_2: Optional[str] = None
    property_city: str
    property_state: str
    property_postcode: str
    property_country: str
    scope_of_work: str
    contract_period_days: int
    contract_start_date: date
    contract_end_date: date
    required_licenses: List[str] = Field(default_factory=list) # Every user gets their own unique list.
    custom_licenses: Optional[List[str]] = None
    evaluation_criteria: List[EvaluationCriteria] = Field(default_factory=list)
    tender_fee: float
    min_budget: float
    max_budget: float
    closing_date: date
    closing_time: time
    site_visit_date: Optional[date] = None
    site_visit_time: Optional[time] = None
    contact_person: str
    contact_email: EmailStr
    contact_phone: str
    tender_documents: List[str] = Field(default_factory=list)
    status: TenderStatus = TenderStatus.DRAFT

class TenderCreateRequest(TenderBase):
    pass

class TenderUpdateRequest(BaseModel):
    title: Optional[str] = None  
    description: Optional[str] = None
    service_type: Optional[str] = None
    custom_service_type: Optional[str] = None
    property_name: Optional[str] = None
    property_address_line_1: Optional[str] = None
    property_address_line_2: Optional[str] = None
    property_city: Optional[str] = None
    property_state: Optional[str] = None
    property_postcode: Optional[str] = None
    property_country: Optional[str] = None
    scope_of_work: Optional[str] = None
    contract_period_days: Optional[int] = None
    contract_start_date: Optional[date] = None
    contract_end_date: Optional[date] = None
    required_licenses: Optional[List[str]] = None
    custom_licenses: Optional[List[str]] = None
    evaluation_criteria: Optional[List[EvaluationCriteria]] = None
    tender_fee: Optional[float] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    closing_date: Optional[date] = None
    closing_time: Optional[time] = None
    site_visit_date: Optional[date] = None
    site_visit_time: Optional[time] = None
    contact_person: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    tender_documents: Optional[List[str]] = None
    status: Optional[TenderStatus] = None

class TenderResponse(TenderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by_id: Optional[int] = None

    class Config:
        from_attributes = True

class TenderPublicResponse(BaseModel):
    id: int
    title: str
    property_name: str
    service_type: str
    closing_date: date
    TenderStatus: TenderStatus
    model_config = ConfigDict(from_attributes=True)

class TenderListResponse(BaseModel):
    tenders: List[TenderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int