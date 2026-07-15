from datetime import datetime
from enum import Enum
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, conint, confloat


class IncidentStatus(str, Enum):
    open = "open"
    investigating = "investigating"
    resolved = "resolved"
    closed = "closed"


class IncidentSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: IncidentSeverity = IncidentSeverity.medium


class IncidentUpdate(BaseModel):
    status: Optional[IncidentStatus] = None
    root_cause: Optional[str] = None
    confidence_score: Optional[confloat(ge=0, le=100)] = None
    resolved_at: Optional[datetime] = None


class IncidentOut(BaseModel):
    id: UUID
    org_id: UUID
    title: str
    description: Optional[str] = None
    status: IncidentStatus
    severity: IncidentSeverity
    root_cause: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ChatRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatMessageCreate(BaseModel):
    session_id: UUID
    role: ChatRole
    content: str


class ChatMessageOut(ChatMessageCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIMemoryCreate(BaseModel):
    incident_id: UUID
    summary: str
    resolution: Optional[str] = None
    embedding: List[float] = Field(..., min_length=1536, max_length=1536)


class AIMemoryOut(BaseModel):
    id: UUID
    incident_id: UUID
    summary: str
    resolution: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActionType(str, Enum):
    rollback = "rollback"
    restart = "restart"
    scale = "scale"
    other = "other"


class RecommendationCreate(BaseModel):
    incident_id: UUID
    action_type: ActionType
    description: str
    confidence_score: Optional[confloat(ge=0, le=100)] = None


class RecommendationOut(RecommendationCreate):
    id: UUID
    approved: bool
    approved_by: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeedbackCreate(BaseModel):
    incident_id: UUID
    rating: conint(ge=1, le=5)
    comment: Optional[str] = None


class FeedbackOut(FeedbackCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationType(str, Enum):
    incident = "incident"
    recommendation = "recommendation"
    system = "system"


class NotificationOut(BaseModel):
    id: UUID
    user_id: UUID
    type: NotificationType
    message: str
    read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)