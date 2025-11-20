# 🔥 Firebase Setup Guide for Finnish Vocabulary App

## ✅ Current Status

- ✅ Firebase configuration moved to environment variables (.env)
- ✅ Environment variables properly configured
- ✅ .gitignore includes .env files (secure)
- ✅ TypeScript types for environment variables added
- ⚠️ Need to enable Firestore API in Firebase Console

## 🚀 Next Steps to Complete Setup

### 1. Enable Firestore API

Visit this link and enable Firestore for your project:

```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=finnish-vocabulary-1eb04
```

### 2. Set up Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/finnish-vocabulary-1eb04)
2. Click on "Firestore Database" in the left sidebar
3. **If you see "Get started"**: Click "Create database"
   - Choose "Start in test mode" (this automatically sets permissive rules)
   - Select a location close to you (e.g., europe-west1)
4. **If database already exists**: Go to step 3 below to update rules

### 3. Fix Firestore Security Rules

**This is the most likely cause of your error!**

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the existing rules with this (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access during development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish" to save the new rules
5. **Wait 1-2 minutes** for the rules to propagate

### 4. Seed the Database

After setting up Firestore rules and waiting 1-2 minutes, run the seeding script:

```bash
node src/database/seed-firebase.js
```

**If you still get permission errors:**

1. Double-check that you published the rules in step 3
2. Wait 2-3 minutes for Firebase to propagate the rule changes
3. Try running the script again

### 5. Test Your App

```bash
npm run dev
```

## 🔒 Security Features Added

### Environment Variables

- Firebase config is now in `.env` file (not committed to git)
- `.env.example` shows the structure without real values
- TypeScript types ensure type safety

### File Structure

```
.env                    # Your actual config (gitignored)
.env.example           # Template for others
src/vite-env.d.ts      # TypeScript environment types
seed-firebase.js       # Seeding script using env vars
```

## 🛠️ Development Workflow

### For You (Project Owner)

1. Keep your `.env` file with real Firebase values
2. Never commit `.env` to git (it's already gitignored)
3. Update `.env.example` if you add new environment variables

### For Other Developers

1. Copy `.env.example` to `.env`
2. Replace placeholder values with real Firebase config
3. Follow the Firebase setup steps above

## 📁 Files Modified

- `src/firebase.ts` - Uses environment variables
- `.env` - Your Firebase configuration (gitignored)
- `.env.example` - Template for other developers
- `src/vite-env.d.ts` - TypeScript environment types
- `seed-firebase.js` - Seeding script with env vars
- `.gitignore` - Already excludes .env files

## 🚨 Next Action Required

**You're getting a permission error because Firestore security rules are blocking access.**

### Quick Fix:

1. Go to [Firebase Console → Firestore → Rules](https://console.firebase.google.com/project/finnish-vocabulary-1eb04/firestore/rules)
2. Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Click "Publish"
4. Wait 1-2 minutes
5. Run `node seed-firebase.js` again

## 🔧 Troubleshooting

### Permission Denied Error

- **Cause**: Firestore security rules are too restrictive
- **Solution**: Update rules as shown above
- **Note**: Wait 1-2 minutes after publishing rules

### "Firestore API not enabled" Error

- **Cause**: Firestore API is disabled
- **Solution**: Visit the Firestore API link in step 1 above

After enabling, you can run the seeding script and your app will work! 🎉
