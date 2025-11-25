# Finnish Vocabulary Learning App

A modern, interactive vocabulary learning application for Finnish language learners built with React, TypeScript, and Vite.

## ✨ Features

- **🌐 Bilingual Interface** - Complete English/Finnish language switching with intuitive Globe icon
- **4,400+ High-Quality Finnish vocabulary words** with authentic translations
- **16 Semantic categories** (Family & People, Nature & Weather, Food & Drink, etc.)
- **📝 Part of Speech Display** - Grammar context shown next to pronunciation
- **🔄 Smart Random Navigation** - No more repetitive back-and-forth through vocabulary
- **Interactive flashcards** with swipe gestures and keyboard navigation
- **Pronunciation guide** with IPA notation
- **Real Finnish examples** showing words in context
- **3 Difficulty levels** based on CEFR standards (A1-A2: Beginner, B1-B2: Intermediate, C1: Advanced)
- **Clean translations** - No grammatical descriptions or inflections
- **📱 Responsive design** works on desktop and mobile

## 🏗️ Architecture

**Modern Cloud-Native Stack:**

- **React frontend** - Single-page application with TypeScript
- **Firebase Firestore** - NoSQL database for vocabulary and user data
- **Firebase Auth** - Google authentication for user accounts
- **localStorage caching** - Client-side caching with 24-hour expiry
- **Real-time updates** - Live data synchronization

**Performance Optimized:**

- **Smart caching** - Reduces Firebase reads by serving cached vocabulary
- **Lazy loading** - Efficient data fetching with error recovery
- **Responsive design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

1. **Clone and install:**

```bash
git clone <repository-url>
cd finnish-vocabulary-learning-app
npm install
```

2. **Set up Firebase:**

- Create a Firebase project at https://console.firebase.google.com/
- Enable Firestore Database and Authentication
- Copy your Firebase config to `.env` file (see `.env.example`)
- Upload vocabulary data using the provided scripts

3. **Start development server:**

```bash
npm run dev
```

4. **Open your browser:**

- App will be available at `http://localhost:3000`
- Sign in with Google to access all features

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── VocabularySwiper.tsx   # Flashcard interface
│   ├── CategoryList.tsx       # Category navigation
│   ├── FolderManager.tsx      # User folder organization
│   ├── AddToFolderModal.tsx   # Folder selection modal
│   └── figma/                 # Figma design components
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── hooks/
│   ├── useFirestoreVocabulary.ts  # Firebase vocabulary data with caching
│   ├── useAIVocabulary.ts      # AI-powered vocabulary features
│   └── useApiVocabulary.ts     # Legacy JSON loading (deprecated)
├── services/
│   ├── firebaseAuth.ts         # Authentication service
│   ├── firebaseVocabulary.ts   # User data operations (favorites/folders)
│   └── firestore.ts            # Firestore utilities
├── PracticeGame/        # Quiz and practice components
├── firebase.ts          # Firebase configuration
├── App.tsx              # Main application
├── main.tsx             # Entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions

public/                  # Static assets (currently empty - data moved to Firebase)

scripts/
├── upload-to-firestore.js       # Upload vocabulary data to Firebase
├── ai-cli.js                   # AI processing command line interface
├── ai-config.js                # AI service configuration
└── ai-example-generator.js     # Generate AI examples
```

## 📊 Data Quality & Processing

**Source Data:** 263,000+ entries from kaikki.org Finnish dictionary

**Processing Pipeline:**

1. **Extract vocabulary** - Filter Finnish words with good translations
2. **Semantic categorization** - Assign meaningful learning categories
3. **Clean translations** - Remove grammatical descriptions and inflections
4. **Quality filtering** - Keep only categories with 10+ words

**Final Dataset:**

- **4,679 vocabulary words** with authentic translations
- **16 categories** including semantic topics and parts of speech
- **CEFR levels** mapped to beginner/intermediate/advanced
- **Zero inflected forms** - Only base vocabulary for learning

## 📚 Categories

**🌐 Available in English and Finnish!**

**Semantic Categories:**

- 👨‍👩‍👧‍👦 Family & People / Perhe & Ihmiset (81 words)
- ⏰ Time & Numbers / Aika & Numerot (80 words)
- 🏃 Basic Actions / Perustoiminnot (101 words)
- 🌦️ Nature & Weather / Luonto & Sää (100 words)
- 🎨 Colors & Appearance / Värit & Ulkonäkö (92 words)
- 👤 Body / Keho (59 words)
- 🍽️ Food & Drink / Ruoka & Juoma (58 words)
- 🐾 Animals / Eläimet (52 words)
- 🎓 Work & Education / Työ & Koulutus (51 words)
- 🚗 Transportation / Liikenne (43 words)
- 😊 Emotions & Mental States / Tunteet & Mielentilat (35 words)
- 🏠 Home & Living / Koti & Asuminen (31 words)

**Grammar Categories:**

- 📦 Noun / Substantiivi (3,394 words)
- 🎨 Adjective / Adjektiivi (726 words)
- 🏃 Verb / Verbi (548 words)
- 🔗 Preposition / Prepositio (11 words)

**Difficulty Distribution:**

- 🟢 **Beginner** (A1-A2): 2,648 words
- 🟡 **Intermediate** (B1-B2): 1,275 words
- 🔴 **Advanced** (C1): 756 words

## 🧹 Data Cleaning Process

**Removed problematic entries:**

- ❌ "alas → second-person singular present imperative of alkaa"
- ❌ "sienna → alternative form of siena"
- ❌ "YT → initialism of yhteistoiminta"
- ❌ "pellet → nominative plural of pelle"

**Kept quality translations:**

- ✅ "luu → bone"
- ✅ "nainen → woman"
- ✅ "kärpänen → fly"
- ✅ "basis → basis, base"

**Result:** Removed 321 poor entries (6.4%), keeping 4,679 high-quality vocabulary words.

## 🎯 Why Firebase?

**Evolution:** JSON files → Firebase Firestore

**Benefits:**

- ✅ **User accounts** - Google authentication and personalized learning
- ✅ **Cross-device sync** - Favorites and folders sync across devices
- ✅ **Real-time updates** - Live data synchronization
- ✅ **Scalable** - Handles thousands of users without performance issues
- ✅ **Offline-ready** - localStorage caching for offline vocabulary access
- ✅ **Admin-friendly** - Easy data updates without redeploying the app

## 🎮 User Experience

**Bilingual Learning Interface:**

- 🌐 **Language Toggle** - Switch between English and Finnish with Globe icon
- 📱 **Adaptive UI** - All interface elements translate automatically
- 🏷️ **Category Names** - Both semantic and grammar categories show in selected language

**Enhanced Vocabulary Cards:**

- 🔊 **Pronunciation Guide** - IPA notation with audio icon
- 📝 **Part of Speech** - Grammar context in parentheses (noun, verb, adjective, etc.)
- 🔄 **Smart Navigation** - Random vocabulary selection prevents repetition
- ⌨️ **Keyboard Support** - Arrow keys for navigation
- 👆 **Touch Gestures** - Swipe left/right on mobile

**Learning Features:**

- ⭐ **Favorites System** - Save important words
- 📁 **Folder Organization** - Create custom collections
- 📊 **Progress Tracking** - Word count indicators
- 🎯 **Contextual Examples** - Real Finnish sentences

## 🛠️ Development

**Set up Firebase:**

```bash
# 1. Create Firebase project
# 2. Enable Firestore and Authentication
# 3. Copy config to .env file

# 4. Upload vocabulary data
npm run upload:firestore
```

**Regenerate vocabulary:**

```bash
cd scripts
node extract-vocabulary.js    # Extract & categorize from source
node clean-translations.js    # Remove poor translations
node upload-to-firestore.js   # Upload to Firebase
```

**Modify categories:**

1. Update semantic patterns in `scripts/extract-vocabulary.js`
2. Update emoji mappings in `src/hooks/useFirestoreVocabulary.ts` and `CategoryList.tsx`

**Custom examples:**

- The app auto-generates Finnish examples
- Edit `generateFinnishExample()` function to customize

## 🚀 Deployment

**For Vercel/GitHub Pages:**

1. **Set environment variables:**

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

2. **Build and deploy:**

```bash
npm run build
npm run deploy  # For GitHub Pages
```

**For other platforms:**

- Copy `.env` variables to your hosting platform's environment settings
- Deploy the `build/` folder as static files

## 🧹 Recent Improvements

- ✅ **🔥 Firebase Integration** - Migrated from static JSON to Firestore with authentication
- ✅ **👤 User Accounts** - Google sign-in with personalized favorites and folders
- ✅ **📱 Cross-Device Sync** - Learning progress syncs across all devices
- ✅ **⚡ Smart Caching** - 24-hour localStorage caching reduces Firebase reads
- ✅ **🔄 Real-Time Updates** - Live data synchronization
- ✅ **🛡️ Error Recovery** - Robust cache handling with automatic recovery
- ✅ **🌐 Full Bilingual Support** - Complete English/Finnish UI with category name translations
- ✅ **📝 Part of Speech Display** - Grammar context (noun, verb, adjective, etc.) shown on vocabulary cards
- ✅ **🔄 Random Navigation** - Smart random vocabulary selection instead of sequential browsing
- ✅ **Semantic categorization** - 12 meaningful learning topics instead of random categories
- ✅ **Translation cleaning** - Removed 6.4% of poor/inflected entries
- ✅ **Proper difficulty levels** - CEFR-based beginner/intermediate/advanced with correct counts
- ✅ **Quality filtering** - Only categories with 10+ words shown
- ✅ **Authentic Finnish data** - Sourced from kaikki.org linguistic database

## 📝 License

MIT License - Feel free to use for learning Finnish! 🇫🇮
