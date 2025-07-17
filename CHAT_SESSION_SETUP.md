# Chat Session Management Setup Guide

## Database Setup

### 1. Run the SQL Script

Execute the following SQL script in your Supabase SQL Editor:

```sql
-- Create chats table for chat session management
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own chats
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own chats
CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own chats
CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own chats
CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Update messages table to include chat_id (if it doesn't exist)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES chats(id) ON DELETE CASCADE;

-- Create index on chat_id in messages table
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);

-- Update anonymous_sessions table to include chat_id (if it doesn't exist)
ALTER TABLE anonymous_sessions ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES chats(id) ON DELETE CASCADE;

-- Create index on chat_id in anonymous_sessions table
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_chat_id ON anonymous_sessions(chat_id);
```

### 2. Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## Features Implemented

### ✅ Chat Session Management
- **Chats Table**: Created with proper RLS policies
- **Auto Chat Creation**: Creates chat sessions from first message (5-7 words)
- **Message Association**: All messages now linked to chat_id
- **Chat Loading**: Load existing chat messages when selected

### ✅ ChatsSidebar Component
- **Collapsible Design**: Toggle chat list visibility
- **New Chat Button**: Create new chat sessions
- **Chat List**: Display all user chats with titles and dates
- **Chat Selection**: Click to load chat messages
- **Delete Functionality**: Remove unwanted chats
- **Loading States**: Smooth loading indicators

### ✅ Integration
- **User Context**: Only shows for signed-in users
- **Chat Context**: Integrated with existing chat functionality
- **Layout Updates**: Added to main layout with proper styling
- **Sidebar Updates**: Added "Chats" tab for signed-in users

## Usage

### For Signed-in Users:
1. Click the "Chats" tab in the sidebar
2. Click "New Chat" to start a fresh conversation
3. Send your first message - a chat will be automatically created with a title
4. View all your chats in the collapsible sidebar
5. Click any chat to load its messages
6. Delete chats using the trash icon

### For Anonymous Users:
- Continue using the app as before
- No chat session management (as designed)

## Technical Details

### Database Schema
- `chats` table with user_id, title, timestamps
- `messages` table updated with chat_id foreign key
- Proper indexes for performance
- RLS policies for security

### State Management
- `ChatSessionContext`: Manages chat sessions and current chat
- `ChatContext`: Updated to work with chat sessions
- Proper loading states and error handling

### UI Components
- `ChatsSidebar`: Main chat management interface
- Updated `Sidebar`: Added Chats tab
- Responsive design with Tailwind CSS

## Testing

1. Sign in to your account
2. Send a message - verify chat is created
3. Send another message - verify it's saved to the same chat
4. Create a new chat - verify it appears in the list
5. Switch between chats - verify messages load correctly
6. Delete a chat - verify it's removed from the list

## Troubleshooting

### Common Issues:

1. **Chats not appearing**: Check RLS policies and user authentication
2. **Messages not saving**: Verify chat_id is being set correctly
3. **Sidebar not showing**: Ensure user is signed in
4. **Database errors**: Check if tables and columns exist

### Debug Steps:
1. Check browser console for errors
2. Verify Supabase connection
3. Test RLS policies in Supabase dashboard
4. Check environment variables 