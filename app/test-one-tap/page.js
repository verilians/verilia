"use client";

import { useUser } from '../../contexts/UserContext';

export default function TestOneTap() {
  const { user, loading } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Google One Tap Test</h1>
          <p className="text-gray-600">Test the One Tap authentication functionality</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : user ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Successfully Signed In!</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <p className="text-sm text-gray-500">One Tap authentication is working correctly.</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Not Signed In</h2>
            <p className="text-gray-600 mb-4">You should see a Google One Tap prompt in the top-right corner.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Expected behavior:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• One Tap prompt appears in top-right corner</li>
                <li>• Shows "Continue as [Your Name]"</li>
                <li>• Click to instantly sign in</li>
                <li>• No redirect or popup windows</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Setup Requirements:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Google Client ID configured in .env.local</li>
            <li>• Supabase Google OAuth provider enabled</li>
            <li>• Domain added to Google Cloud Console</li>
            <li>• HTTPS required for production</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 