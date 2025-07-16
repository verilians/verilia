import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { user_id, message, sender } = await request.json();

    // Validate required fields
    if (!user_id || !message || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, message, sender' },
        { status: 400 }
      );
    }

    // Insert the message into the messages table
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id,
          message,
          sender,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save message', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 