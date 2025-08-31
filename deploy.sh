#!/bin/bash

# AI Finance - Netlify Deployment Script

echo "🚀 Starting AI Finance deployment to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please log in to Netlify..."
    netlify login
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check your code and try again."
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=.next

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your AI Finance app is now live on Netlify!"
    echo "📝 Don't forget to:"
    echo "   1. Set up environment variables in Netlify dashboard"
    echo "   2. Configure your database for production"
    echo "   3. Update Clerk authentication settings"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
