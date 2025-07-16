import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use the deployed URL for production, localhost for development
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://verilia.vercel.app'
        : request.nextUrl.origin;
      
      return NextResponse.redirect(new URL(next, baseUrl));
    }
  }

  // If there's an error, redirect to home page instead of non-existent error page
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://verilia.vercel.app'
    : request.nextUrl.origin;
  
  return NextResponse.redirect(new URL('/', baseUrl));
} 