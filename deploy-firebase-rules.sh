#!/bin/bash

# Firebase Security Rules Deployment Script
# This script deploys the Firebase database security rules

echo "🚀 Deploying Firebase Security Rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Check if firebase.json exists, if not initialize
if [ ! -f "firebase.json" ]; then
    echo "📁 Initializing Firebase project..."
    firebase init database
fi

# Deploy the rules
echo "📤 Deploying security rules..."
firebase deploy --only database

if [ $? -eq 0 ]; then
    echo "✅ Security rules deployed successfully!"
    echo ""
    echo "🔒 Your database is now secured with the following rules:"
    echo "   - Default: Deny all access"
    echo "   - Public data (universities, FAQs, company): Read-only for public"
    echo "   - User data: Users can only access their own data"
    echo "   - Agent data: Agents can only access their own data"
    echo "   - Inquiries: Anyone can create, only admins can read/write"
    echo "   - Admin access: Full access to all data"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Test the application with different user roles"
    echo "   2. Verify that public data is still accessible"
    echo "   3. Check that user data is properly restricted"
    echo "   4. Monitor for any access issues"
else
    echo "❌ Failed to deploy security rules. Please check the error messages above."
    exit 1
fi 