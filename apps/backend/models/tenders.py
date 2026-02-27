import enum
from sqlalchemy import Date, Time, DateTime, Integer, Float, String, JSON, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from datetime import datetime, date, time
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.users import User
    from models.bids import Bid

class TenderStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    AWARDED = "awarded"
    CANCELLED = "cancelled"  

class Tender(Base):
    __tablename__ = "tenders"

    #Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    #Basic info
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String)
    service_type: Mapped[str] = mapped_column(String, nullable=False)
    custom_service_type: Mapped[str | None] = mapped_column(String)

    #Property details
    property_name: Mapped[str] = mapped_column(String, nullable=False)
    property_address_line_1: Mapped[str] = mapped_column(String, nullable=False)
    property_address_line_2: Mapped[str | None] = mapped_column(String)
    property_city: Mapped[str] = mapped_column(String, nullable=False)
    property_state: Mapped[str] = mapped_column(String, nullable=False)
    property_postcode: Mapped[str] = mapped_column(String, nullable=False)
    property_country: Mapped[str] = mapped_column(String, nullable=False)

    #Scope and requirements
    scope_of_work: Mapped[str] = mapped_column(String, nullable=False)
    contract_period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    contract_start_date: Mapped[date] = mapped_column(Date, nullable=False)  # Fixed: date not datetime
    contract_end_date: Mapped[date] = mapped_column(Date, nullable=False)  # Fixed: date not datetime
    required_licenses: Mapped[list] = mapped_column(JSON, nullable=False, default=list)  
    custom_licenses: Mapped[list | None] = mapped_column(JSON, default=list)  
    evaluation_criteria: Mapped[list] = mapped_column(JSON, nullable=False, default=list) 

    #Budget and fees
    tender_fee: Mapped[float] = mapped_column(Float, nullable=False)  
    min_budget: Mapped[float] = mapped_column(Float, nullable=False)  
    max_budget: Mapped[float] = mapped_column(Float, nullable=False)  

    #Dates and times
    closing_date: Mapped[date] = mapped_column(Date, nullable=False)  
    closing_time: Mapped[time] = mapped_column(Time, nullable=False)  
    site_visit_date: Mapped[date | None] = mapped_column(Date) 
    site_visit_time: Mapped[time | None] = mapped_column(Time)  

    #Contact info
    contact_person: Mapped[str] = mapped_column(String, nullable=False)
    contact_email: Mapped[str] = mapped_column(String, nullable=False)
    contact_phone: Mapped[str] = mapped_column(String, nullable=False)

    #Documents
    tender_documents: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    status: Mapped[TenderStatus] = mapped_column(
        SQLEnum(TenderStatus),  # Use proper Enum column
        nullable=False,
        default=TenderStatus.DRAFT
    )

    #Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow) 
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)  
    created_by_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    created_by: Mapped["User"] = relationship("User", back_populates="tenders", lazy="joined")
    bids: Mapped[list["Bid"]] = relationship("Bid", back_populates="tender", lazy="joined")

    def __repr__(self) -> str:
        return f"<Tender {self.title} ({self.status})>" 

