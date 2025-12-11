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

## 🎯 Why No API Server?

**Before:** React ↔ Express API ↔ JSON files
**Now:** React → JSON files directly

**Benefits:**

- ✅ **Simpler setup** - Just `npm run dev` and go
- ✅ **Faster loading** - No network requests to localhost
- ✅ **Fewer dependencies** - No Express.js needed
- ✅ **Better reliability** - No server crashes or port conflicts
- ✅ **Easier deployment** - Static site deployment

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

**Regenerate vocabulary:**

```bash
cd scripts
node extract-vocabulary.js    # Extract & categorize from source
node clean-translations.js    # Remove poor translations
```

**Modify categories:**

1. Update semantic patterns in `scripts/extract-vocabulary.js`
2. Update emoji mappings in `src/hooks/useApiVocabulary.ts` and `CategoryList.tsx`

**Custom examples:**

- The app auto-generates Finnish examples
- Edit `generateFinnishExample()` function to customize

## 🚀 Deployment

Since this is now a pure static site:

1. **Build for production:**

```bash
npm run build
```

2. **Deploy anywhere:**

- Netlify, Vercel, GitHub Pages
- Any static hosting service
- No server configuration needed!

## 🧹 Recent Improvements

- ✅ **🌐 Full Bilingual Support** - Complete English/Finnish UI with category name translations
- ✅ **📝 Part of Speech Display** - Grammar context (noun, verb, adjective, etc.) shown on vocabulary cards
- ✅ **🔄 Random Navigation** - Smart random vocabulary selection instead of sequential browsing
- ✅ **Semantic categorization** - 12 meaningful learning topics instead of random categories
- ✅ **Translation cleaning** - Removed 6.4% of poor/inflected entries
- ✅ **Proper difficulty levels** - CEFR-based beginner/intermediate/advanced with correct counts
- ✅ **Quality filtering** - Only categories with 10+ words shown
- ✅ **Authentic Finnish data** - Sourced from kaikki.org linguistic database
- ✅ **Removed API server complexity** - Direct JSON loading
- ✅ **Fixed category counts** - All 16 categories now display properly

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 📝 License

MIT License - Feel free to use for learning Finnish! 🇫🇮
