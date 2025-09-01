#!/bin/bash

echo "🚀 Starting deployment to Netlify..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Netlify
    echo "🚀 Deploying to Netlify..."
    npx netlify-cli deploy --prod --dir=.next
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🌐 Your site is live at: https://resilient-tarsier-656726.netlify.app"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
