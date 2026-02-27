from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from models.tenders import Tender
    from models.bids import Bid

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    remember_me: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    role: Mapped[str] = mapped_column(String, nullable=False, default="contractor")

    # Optional one: Update profile fields
    name: Mapped[str | None] = mapped_column(String)
    company_name: Mapped[str | None] = mapped_column(String)
    phone_number: Mapped[str | None] = mapped_column(String)
    website: Mapped[str | None] = mapped_column(String)
    experience_years: Mapped[int | None] = mapped_column(Integer)
    bio: Mapped[str | None] = mapped_column(String)
    
    # Relationships
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="created_by", lazy="select", cascade="all, delete-orphan")
    bids: Mapped[List["Bid"]] = relationship("Bid", back_populates="user", lazy="select", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"

    