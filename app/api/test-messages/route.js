import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  try {
    // Test if we can access the messages table
    const { data, error } = await supabase
      .from('messages')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Messages table error',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    // Test inserting a message
    const testMessage = {
      user_id: 'test-user-id',
      message: 'Test message',
      sender: 'user',
      created_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('messages')
      .insert([testMessage])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code
      }, { status: 500 });
    }

    // Clean up test message
    await supabase
      .from('messages')
      .delete()
      .eq('id', insertData.id);

    return NextResponse.json({
      success: true,
      message: 'Messages table is working correctly',
      tableExists: true,
      canInsert: true,
      canDelete: true
    });

  } catch (error) {
    console.error('Test messages error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
} 