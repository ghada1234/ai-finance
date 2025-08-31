# Deployment Guide - AI Finance to Netlify

This guide will walk you through deploying your AI Finance application to Netlify.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
3. **Clerk Account** - For authentication (sign up at [clerk.com](https://clerk.com))
4. **Database** - For production, you'll need a cloud database

## Step 1: Prepare Your Code

### 1.1 Commit and Push to GitHub

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Prepare for Netlify deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Your Repository

Make sure your repository contains:
- ✅ `package.json` with build scripts
- ✅ `netlify.toml` configuration
- ✅ `next.config.ts`
- ✅ All source code in `src/` directory

## Step 2: Set Up Clerk Authentication

### 2.1 Create a Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Create a new application
3. Note down your API keys:
   - Publishable Key
   - Secret Key

### 2.2 Configure Clerk Settings

In your Clerk dashboard:
1. Go to **Settings** > **Domains**
2. Add your Netlify domain (e.g., `https://your-app.netlify.app`)
3. Add `http://localhost:3000` for local development

## Step 3: Set Up Production Database

### 3.1 Choose a Database Provider

For production, you need a cloud database. Recommended options:

**Option A: PlanetScale (MySQL)**
```bash
# Install PlanetScale CLI
npm install -g pscale

# Create database
pscale database create ai-finance

# Get connection string
pscale connect ai-finance main
```

**Option B: Supabase (PostgreSQL)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database

**Option C: Railway (PostgreSQL)**
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Get your connection string

### 3.2 Update Prisma Schema (if needed)

If switching from SQLite to PostgreSQL/MySQL:

```bash
# Update your schema.prisma
# Change datasource from sqlite to postgresql or mysql
```

## Step 4: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Click "Deploy site"

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

3. **Set Environment Variables**
   - In your Netlify dashboard, go to **Site settings** > **Environment variables**
   - Add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_random_secret_string
NEXT_PUBLIC_SITE_URL=https://your-app-name.netlify.app
```

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Initialize and Deploy**
```bash
# Initialize Netlify in your project
netlify init

# Deploy to production
netlify deploy --prod
```

### Option C: Use the Deployment Script

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## Step 5: Post-Deployment Configuration

### 5.1 Update Clerk Settings

1. Go to your Clerk dashboard
2. Add your Netlify domain to allowed domains
3. Update redirect URLs if needed

### 5.2 Test Your Application

1. Visit your Netlify URL
2. Test the following features:
   - ✅ User registration/login
   - ✅ Dashboard loading
   - ✅ Receipt scanner (upload functionality)
   - ✅ Analytics page
   - ✅ Reports page
   - ✅ Budget management

### 5.3 Set Up Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Step 6: Environment Variables Reference

### Required Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Next Auth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-app.netlify.app

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

### Optional Environment Variables

```env
# AI Services (for future integration)
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_VISION_API_KEY=your_google_vision_key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-...
```

## Troubleshooting

### Common Issues

**1. Build Fails**
- Check if all dependencies are in `package.json`
- Verify Node.js version (should be 18+)
- Check for TypeScript errors

**2. Authentication Issues**
- Verify Clerk API keys are correct
- Check if domains are properly configured in Clerk
- Ensure environment variables are set in Netlify

**3. Database Connection Issues**
- Verify DATABASE_URL is correct
- Check if database is accessible from Netlify
- Ensure database schema is migrated

**4. API Routes Not Working**
- Check if API routes are properly configured
- Verify environment variables are accessible
- Check Netlify function logs

### Getting Help

1. **Check Netlify Logs**
   - Go to your site dashboard
   - Click on "Functions" tab
   - Check for any error messages

2. **Check Build Logs**
   - In your site dashboard, go to "Deploys"
   - Click on the latest deploy
   - Check the build logs for errors

3. **Local Testing**
   - Test locally with production environment variables
   - Use `npm run build` to check for build issues

## Performance Optimization

### 1. Enable Netlify Edge Functions

Update your `netlify.toml`:

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[edge_functions]]
  function = "api/*"
  path = "/api/*"
```

### 2. Optimize Images

- Use Next.js Image component
- Implement proper image optimization
- Consider using Netlify's image optimization

### 3. Enable Caching

Add to your `netlify.toml`:

```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to Git
   - Use Netlify's environment variable system
   - Rotate keys regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Implement proper access controls

3. **Authentication**
   - Configure proper session management
   - Enable MFA in Clerk
   - Set up proper redirect URLs

## Monitoring and Analytics

1. **Set up Netlify Analytics**
   - Enable in your site settings
   - Monitor performance metrics

2. **Error Tracking**
   - Consider adding Sentry or similar
   - Monitor API errors

3. **Performance Monitoring**
   - Use Netlify's built-in performance monitoring
   - Set up alerts for downtime

## Next Steps

After successful deployment:

1. **Set up monitoring and alerts**
2. **Configure backup strategies**
3. **Plan for scaling**
4. **Set up CI/CD pipelines**
5. **Implement security best practices**

Your AI Finance application should now be live on Netlify! 🎉
