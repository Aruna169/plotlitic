# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "graph-comments")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (select closest to your users)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon "</>" to add a web app
5. Give it a name (e.g., "Graph App")
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Update Your Code

1. Open `src/firebase/config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Set Firestore Security Rules (Production)

Before going to production, update your Firestore security rules:

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appFeedback/{document=**} {
      // Allow anyone to write (create)
      allow create: if true;
      // Only allow reading feedback
      allow read: if true;
    }
  }
}
```

## Step 6: Test It Out!

1. Run your app: `npm run dev`
2. Create a graph with some data points
3. Click the 💬 icon in the bottom navigation
4. Enter a comment and click "Save Comment"
5. Check Firebase Console → Firestore Database to see your saved data!

## Troubleshooting

**Error: "Firebase not defined"**
- Make sure you've updated `src/firebase/config.js` with your actual config

**Error: "Permission denied"**
- Check Firestore security rules (Step 5)
- Make sure you're in "test mode" for development

**Error: "Failed to save comment"**
- Check browser console for detailed error
- Verify Firebase config is correct
- Ensure Firestore is enabled in Firebase Console

## Free Tier Limits

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

This should be more than enough for personal use!
