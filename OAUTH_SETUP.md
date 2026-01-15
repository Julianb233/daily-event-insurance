# OAuth Social Sign-On Setup Guide

Google and GitHub OAuth providers have been added to the authentication system. Follow the steps below to configure them.

## Implementation Summary

### Updated Files:
1. **lib/auth.ts** - Added Google and GitHub OAuth providers
2. **app/sign-in/page.tsx** - Added social login buttons with Google and GitHub
3. **.env.local** - Added placeholder environment variables

## Configuration Steps

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Daily Event Insurance
   - Support email: Your email
   - Authorized domains: dailyeventinsurance.com
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Daily Event Insurance Web
   - Authorized JavaScript origins:
     - `https://dailyeventinsurance.com`
     - `http://localhost:3000` (for development)
   - Authorized redirect URIs:
     - `https://dailyeventinsurance.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for development)
7. Copy the Client ID and Client Secret to your `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Daily Event Insurance
   - Homepage URL: `https://dailyeventinsurance.com`
   - Authorization callback URL: `https://dailyeventinsurance.com/api/auth/callback/github`
4. For development, create a separate OAuth App with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. After creation, generate a new client secret
6. Copy the Client ID and Client Secret to your `.env.local`:
   ```
   GITHUB_ID=your_client_id_here
   GITHUB_SECRET=your_client_secret_here
   ```

## Environment Variables

Add these to your `.env.local` file (already added as placeholders):

```env
# OAuth Providers (Social Sign-On)
# Google OAuth - Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth - Get credentials from: https://github.com/settings/developers
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

## Testing

1. After adding credentials, restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/sign-in`
3. You should see three sign-in options:
   - Email/Password form
   - "Continue with Google" button
   - "Continue with GitHub" button

4. Test each OAuth provider to ensure proper authentication flow

## Features Implemented

- Professional-looking social login buttons with provider logos
- Loading states for each button during authentication
- Error handling for failed OAuth attempts
- Disabled state management to prevent multiple concurrent sign-in attempts
- Matches existing UI design (rounded corners, teal accent colors)
- "Or continue with" divider separating credential and social login options

## User Flow

1. User clicks "Continue with Google" or "Continue with GitHub"
2. User is redirected to provider's authorization page
3. User grants permissions
4. User is redirected back to the application
5. NextAuth creates/updates user account in database
6. User is signed in and redirected to dashboard

## Database Integration

The social sign-on automatically integrates with your existing Drizzle ORM schema:
- `users` table - Stores user profile information
- `accounts` table - Links OAuth provider accounts to users
- `sessions` table - Manages user sessions

Users can sign in with multiple providers (linking accounts) as long as they use the same email address.

## Security Notes

- Never commit OAuth credentials to version control
- Use different OAuth apps for development and production
- Regularly rotate client secrets
- Monitor OAuth usage in provider consoles
- Ensure callback URLs match exactly (including protocol)
