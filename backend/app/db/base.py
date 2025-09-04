# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.health import HealthProfile, Consultation, HealthMetric  # noqa
from app.models.conversations import Conversation, Message  # noqa
from app.models.feedback import ConversationFeedback  # noqa