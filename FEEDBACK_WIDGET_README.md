# AI Consultation Feedback Widget

A simple feedback widget that allows users to rate their AI consultation experience with 👍 or 👎 and optionally provide comments.

## Features

- **Simple Rating**: Users can click thumbs up (👍) or thumbs down (👎)
- **Optional Comments**: Users can provide additional feedback text
- **Smooth Animations**: Uses Framer Motion for polished interactions
- **Database Storage**: Feedback is stored in the backend database
- **Duplicate Prevention**: Updates existing feedback if user submits again for same conversation

## Backend Implementation

### Database Model
- **Table**: `conversation_feedback`
- **Fields**: 
  - `id` (Primary Key)
  - `conversation_id` (Foreign Key to conversations)
  - `user_id` (Foreign Key to users)
  - `rating` ('positive' or 'negative')
  - `comment` (Optional text)
  - `created_at` (Timestamp)

### API Endpoints
- `POST /api/v1/feedback/` - Submit feedback
- `GET /api/v1/feedback/{conversation_id}` - Get existing feedback

### Migration
Run the database migration to create the feedback table:
```bash
cd backend
alembic upgrade head
```

## Frontend Implementation

### FeedbackWidget Component
Located at `src/components/ui/feedback-widget.tsx`

**Props:**
- `conversationId` (string): The ID of the conversation to provide feedback for
- `onFeedbackSubmitted` (optional): Callback function when feedback is submitted
- `className` (optional): Additional CSS classes

**Usage:**
```tsx
import { FeedbackWidget } from '@/components/ui/feedback-widget';

<FeedbackWidget
  conversationId="conversation-123"
  onFeedbackSubmitted={(rating, comment) => {
    console.log('Feedback:', { rating, comment });
  }}
/>
```

### Integration Points
The widget is automatically shown in:
1. **ConversationalInterface** - When consultation stage reaches 'recommendations'
2. **ConversationalChat** - When assessment is complete

## Service Layer
The `feedbackService` handles API communication with proper authentication using Supabase tokens.

## Styling
- Uses Tailwind CSS classes
- Follows the existing design system
- Responsive design
- Smooth animations with Framer Motion

## States
1. **Initial**: Shows rating buttons
2. **Rating Selected**: Shows submit/comment options
3. **Comment Mode**: Shows textarea for additional feedback
4. **Submitted**: Shows thank you message with option to submit new feedback

## Error Handling
- Network errors are caught and displayed via toast notifications
- Graceful fallbacks for authentication issues
- User-friendly error messages

## Testing
You can test the widget using the example component at `src/components/FeedbackExample.tsx`

## Future Enhancements
- Analytics dashboard for feedback data
- Email notifications for negative feedback
- Sentiment analysis of comments
- Integration with customer support systems