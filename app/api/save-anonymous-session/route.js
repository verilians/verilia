import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { sessionId, messages, timestamp } = await request.json();

    // Validate required fields
    if (!sessionId || !messages || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, messages, timestamp' },
        { status: 400 }
      );
    }

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('anonymous_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existingSession) {
      // Update existing session
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .update({
          messages: messages,
          updated_at: timestamp
        })
        .eq('session_id', sessionId)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to update anonymous session', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Anonymous session updated successfully',
        data: data[0]
      });
    } else {
      // Insert new session
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .insert([
          {
            session_id: sessionId,
            messages: messages,
            created_at: timestamp,
            updated_at: timestamp
          }
        ])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to save anonymous session', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Anonymous session saved successfully',
        data: data[0]
      });
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save anonymous session', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Anonymous session saved successfully',
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