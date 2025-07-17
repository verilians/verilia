"use client";

import { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

const GoogleOneTap = () => {
  const { user } = useUser();
  const oneTapRef = useRef(null);
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only show One Tap if user is not already signed in
    if (user || initialized.current) return;

    // Check if Google Client ID is configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured. One Tap will not work.');
      return;
    }

    // Load Google Identity Services
    const loadGoogleIdentity = () => {
      if (window.google && window.google.accounts) {
        initializeOneTap();
      } else {
        // Load the Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.accounts) {
            initializeOneTap();
          }
        };
        script.onerror = () => {
          console.error('Failed to load Google Identity Services script');
        };
        document.head.appendChild(script);
      }
    };

    const initializeOneTap = () => {
      if (!window.google || !window.google.accounts || initialized.current) return;

      try {
        initialized.current = true;
        
        // Initialize One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: oneTapRef.current,
          context: 'signin',
          ux_mode: 'popup',
          state_cookie_domain: window.location.hostname
        });

        // Display One Tap
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap is not displayed or skipped
            const reason = notification.getNotDisplayedReason();
            console.log('One Tap not displayed:', reason);
            
            // Reset initialization if it was due to configuration issues
            if (reason === 'browser_not_supported' || reason === 'invalid_client') {
              initialized.current = false;
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
        initialized.current = false;
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        setIsLoading(true);
        
        // Extract the ID token from the response
        const { credential } = response;
        
        // Sign in with Supabase using the Google ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: credential,
        });
        
        if (error) {
          console.error('Error signing in with One Tap:', error);
          // Show user-friendly error message
          alert('Sign-in failed. Please try again or use the manual sign-in option.');
        }
      } catch (error) {
        console.error('Error handling One Tap response:', error);
        alert('Sign-in failed. Please try again or use the manual sign-in option.');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure the component is mounted and page is loaded
    const timer = setTimeout(loadGoogleIdentity, 1500);

    return () => {
      clearTimeout(timer);
      // Clean up One Tap if component unmounts
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, [user]);

  // Don't render anything if user is already signed in
  if (user) return null;

  return (
    <>
      <div 
        ref={oneTapRef}
        className="fixed top-4 right-4 z-50"
        style={{ 
          width: '400px',
          height: 'auto',
          maxWidth: '90vw'
        }}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700">Signing you in...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleOneTap; 