# DEPLOYMENT GUIDE

## Production Deployment Steps

### 1. Set up Neon Database (Already Done)
Your database is already connected:
- Project: decision-dna-tracker-db
- Connection: Configured in `.env.local`

### 2. Generate AUTH_SECRET for Production
```bash
openssl rand -base64 32
```
Copy the output and use it in Vercel environment variables.

### 3. Vercel Environment Variables Required
Set these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgres://... (your Neon connection string)
AUTH_SECRET=<generated 32-char secret>
AUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=<optional - from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<optional - from Google Cloud Console>
RESEND_API_KEY=<optional - from Resend.com>
CRON_SECRET=<any random string>
```

### 4. GitHub Secrets (for CI/CD)
Set these in GitHub Repository → Settings → Secrets and variables → Actions:

```
DATABASE_URL=postgres://...
AUTH_SECRET=<same as Vercel>
AUTH_URL=http://localhost:3000 (for CI only)
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
RESEND_API_KEY=<optional>
CRON_SECRET=<same as Vercel>
```

### 5. Google OAuth Setup (Optional but Recommended)
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Client Secret to environment variables

### 6. Deploy
Once environment variables are set:
1. Vercel will auto-deploy on push to main
2. Database schema will be pushed automatically
3. Check deployment status at: https://vercel.com/dashboard

### 7. Verify Deployment
After deployment:
- Visit your Vercel URL
- Try signing up with email/password
- Create a workspace
- Verify decisions can be created

## Troubleshooting

### Build Fails
Check Vercel deployment logs for specific errors.

### Auth Not Working
1. Verify AUTH_SECRET is set in Vercel
2. Check that DATABASE_URL is correct
3. Ensure users table exists (run `npm run db:push` locally first if needed)

### Database Connection Errors
1. Verify Neon connection string in `.env.local`
2. Check Neon project is active
3. Ensure firewall allows connections from Vercel

### Google OAuth Errors
1. Verify redirect URI matches exactly
2. Check Client ID and Secret are correct
3. Ensure Google+ API is enabled

## Current Status
✅ Database: Neon PostgreSQL connected
✅ Schema: Drizzle ORM configured
✅ Auth: NextAuth v5 with credentials + Google
✅ Deployment: Vercel auto-deploys on push
✅ CI: GitHub Actions for type checking

## Next Steps
1. Set Vercel environment variables (AUTH_SECRET required)
2. Deploy to Vercel
3. Test signup/login flow
4. Add Google OAuth credentials (optional)
