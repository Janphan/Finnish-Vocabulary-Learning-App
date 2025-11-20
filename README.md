# 🇫🇮 Finnish Vocabulary Learning App

A modern, interactive web application for learning Finnish vocabulary with Firebase backend.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd Finnish-Vocabulary-Learning-App
   npm install
   ```

2. **Configure Firebase**
   ```bash
   cp .env.example .env
   # Add your Firebase config to .env
   ```

3. **Seed Database**
   ```bash
   node src/database/seed-firebase.js
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── components/            # React components
│   ├── CategoryList.tsx   # Category selection interface
│   ├── VocabularySwiper.tsx # Word learning interface
│   ├── FolderManager.tsx  # User folder management
│   └── ui/               # Reusable UI components
└── database/             # All database-related files
    ├── index.ts          # Database exports
    ├── firebase.ts       # Firebase configuration
    ├── firebaseVocabularyService.ts # Database operations
    ├── useFirebaseVocabulary.ts     # React hooks
    └── seed-firebase.js  # Data seeding script
```

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Vite
- **Database**: Firebase Firestore
- **UI**: Tailwind CSS + Lucide Icons
- **State**: React Hooks

## 📱 Features

- ✅ **Interactive Learning**: Swipe through vocabulary cards
- ✅ **Categories**: Organized by topics (greetings, family, animals, etc.)
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Firebase Backend**: Real-time data with scalable architecture
- ✅ **User Folders**: Create custom word collections
- ✅ **Search & Filter**: Find specific vocabulary

## 🔧 Development

- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## 📚 Documentation

- **Firebase Setup**: `FIREBASE_SECURITY_SETUP.md`
- **Deployment**: `DEPLOYMENT_OPTIONS.md`