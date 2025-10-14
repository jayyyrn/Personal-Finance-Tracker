import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "sonner@2.0.3";

// Google Logo SVG Component
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const GoogleSignInButton = ({ onSuccess, variant = "outline" }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, you would integrate with Google OAuth
      // For demo purposes, we'll simulate a Google sign-in
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google OAuth response
      const mockGoogleUser = {
        email: 'google.user@gmail.com',
        password: 'google-oauth-token' // This would be handled differently in real OAuth
      };
      
      await login(mockGoogleUser);
      toast.success('Successfully signed in with Google!');
      onSuccess?.();
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      {loading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};

// Real Google OAuth Integration Instructions:
/*
To implement real Google OAuth, you would:

1. Install Google OAuth library:
   npm install @google-cloud/oauth2

2. Set up Google OAuth credentials in Google Cloud Console

3. Replace the mock implementation above with:

import { GoogleAuth } from '@google-cloud/oauth2';

const googleAuth = new GoogleAuth({
  credentials: {
    client_id: 'YOUR_GOOGLE_CLIENT_ID',
    client_secret: 'YOUR_GOOGLE_CLIENT_SECRET',
  },
  scopes: ['openid', 'email', 'profile']
});

const handleGoogleSignIn = async () => {
  try {
    const authUrl = googleAuth.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile']
    });
    
    // Redirect to Google OAuth
    window.location.href = authUrl;
  } catch (error) {
    toast.error('Google sign-in failed');
  }
};

4. Handle the OAuth callback in your backend
5. Exchange the authorization code for tokens
6. Use the tokens to authenticate the user

For now, the mock implementation allows you to test the UI flow.
*/