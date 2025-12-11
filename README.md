# Finnish Vocabulary Learning App

A modern React-based app for learning Finnish vocabulary with spaced repetition, Firebase integration, and bilingual support.

## 🎥 Demo

Check out the app in action: [YouTube Demo](https://www.youtube.com/watch?v=Bcwf0F4_alA)

## ✨ Features

- **Bilingual Learning**: Finnish ↔ English vocabulary with pronunciation guides
- **Category-Based Organization**: Learn by topics (Family, Food, Travel, etc.)
- **Spaced Repetition System (SRS)**: SM-2 algorithm for optimal review scheduling
- **Practice Quiz**: Multiple-choice questions with random word selection
- **User Authentication**: Google Sign-In for personalized learning
- **Favorites & Folders**: Save and organize personal vocabulary
- **Responsive Design**: Works on desktop and mobile
- **Offline Caching**: Vocabulary cached locally to reduce Firebase reads

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS for responsive UI
- **Backend**: Firebase Firestore for data storage
- **Authentication**: Firebase Auth with Google Sign-In
- **Caching**: LocalStorage for vocabulary and user data
- **SRS Algorithm**: SM-2 spaced repetition for adaptive learning intervals
- **Testing**: Vitest for unit tests (SRS logic, components)

## 📁 Project Structure

```
src/
├── components/
│ ├── VocabularySwiper.tsx # Main vocabulary display with SRS
│ ├── ReviewSession.tsx # SRS review interface
│ ├── CategoryList.tsx # Category navigation
│ └── ui/ # UI components
├── hooks/
│ ├── useFirestoreVocabulary.ts # Firebase data fetching with caching
├── services/
│ ├── firebaseVocabulary.ts # Firebase operations
│ ├── srsService.ts # SRS algorithm logic
├── utils/
│ ├── srsLogic.test.ts # SRS logic unit tests
├── pages/
│ ├── Login.tsx # Authentication
│ ├── Register.tsx # User registration
│ ├── ResetPassword.tsx # Password reset
├── PracticeGame/
│ ├── PracticeQuiz.tsx # Random practice quiz
├── App.tsx # Main app component
├── main.tsx # Entry point
└── ...

public/
├── (empty - data stored in Firebase)

scripts/
├── upload-to-firestore.js # Upload vocabulary to Firebase
├── ai-cli.js # AI processing scripts
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

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 📝 License

MIT License - Feel free to use for learning Finnish! 🇫🇮
