from sqlalchemy import Integer, Float, String, ForeignKey, Enum as SQLEnum, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
import enum
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.tenders import Tender
    from models.users import User

class BidStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    AWARDED = "awarded"

class Bid(Base):
    __tablename__ = "bids"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    tender_id: Mapped[int] = mapped_column(Integer, ForeignKey("tenders.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    # Company & Contact
    company_name: Mapped[str] = mapped_column(String, nullable=False)
    company_registration: Mapped[str] = mapped_column(String, nullable=False)
    company_address: Mapped[str] = mapped_column(String, nullable=False)
    company_website: Mapped[str | None] = mapped_column(String)

    contact_person_name: Mapped[str] = mapped_column(String, nullable=False)
    contact_person_phone: Mapped[str] = mapped_column(String, nullable=False)
    contact_person_email: Mapped[str] = mapped_column(String, nullable=False)
    
    # Financial Proposal
    proposed_amount: Mapped[float] = mapped_column(Float, nullable=False)
    include_sst: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    payment_terms: Mapped[str] = mapped_column(String, nullable=False)
    validity_period_days: Mapped[int] = mapped_column(Integer, nullable=False)

    # Technical Proposal
    supporting_documents: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    methodology: Mapped[str | None] = mapped_column(String)
    proposed_timeline: Mapped[str | None] = mapped_column(String)
    agree_to_terms: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[BidStatus] = mapped_column(SQLEnum(BidStatus), nullable=False, default=BidStatus.SUBMITTED)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)  

    # Relationships
    tender: Mapped["Tender"] = relationship("Tender", back_populates="bids", lazy="joined")
    user: Mapped["User"] = relationship("Users", back_populates="bids", lazy="joined")

    def __repr__(self) -> str:
        return f"<Bid {self.id} for Tender {self.tender_id} - {self.company_name}>"