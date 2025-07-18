import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS for feedback submissions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { feedback, rating, userId, sessionId } = await request.json();

    // Validate input
    if (!feedback && !rating) {
      return NextResponse.json(
        { error: 'Feedback or rating is required' },
        { status: 400 }
      );
    }

    // Insert feedback into database
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          feedback: feedback || '',
          rating: rating || 0,
          user_id: userId || null,
          session_id: sessionId || null
        }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 