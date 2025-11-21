# Finnish Vocabulary Learning App

A modern, interactive vocabulary learning application for Finnish language learners built with React, TypeScript, and Vite.

## ✨ Features

- **4,400+ High-Quality Finnish vocabulary words** with authentic translations
- **16 Semantic categories** (Family & People, Nature & Weather, Food & Drink, etc.)
- **Interactive flashcards** with swipe gestures
- **Pronunciation guide** with IPA notation
- **Real Finnish examples** showing words in context
- **3 Difficulty levels** based on CEFR standards (A1-A2: Beginner, B1-B2: Intermediate, C1: Advanced)
- **Clean translations** - No grammatical descriptions or inflections
- **Responsive design** works on desktop and mobile

## 🏗️ Architecture

**Simple and Clean:**

- **React frontend** - Single-page application
- **Direct JSON loading** - No API server needed
- **Static data** - Vocabulary loaded from curated JSON files
- **Client-side filtering** - Fast category and difficulty filtering

## 🚀 Quick Start

1. **Clone and install:**

```bash
git clone <repository-url>
cd finnish-vocabulary-learning-app
npm install
```

2. **Start development server:**

```bash
npm run dev
```

3. **Open your browser:**

- App will be available at `http://localhost:3000`
- That's it! No API server setup needed.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── VocabularySwiper.tsx   # Flashcard interface
│   ├── CategoryList.tsx       # Category navigation
│   └── ui/                    # Shadcn/ui components
├── hooks/
│   └── useApiVocabulary.ts    # Vocabulary data loading
├── App.tsx              # Main application
└── main.tsx            # Entry point

public/
├── finnish-vocab-cleaned.json    # 4,700 high-quality vocabulary words
├── finnish-vocab-full.json       # 5,000 raw extracted words
└── kaikki.org-dictionary-Finnish.jsonl  # Source dictionary data

scripts/
├── extract-vocabulary.js         # Extract & categorize vocabulary
├── clean-translations.js         # Remove poor translations
└── fetch-wiktextract.js          # Download source data
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

**Semantic Categories:**

- 👨‍👩‍👧‍👦 Family & People (81 words)
- ⏰ Time & Numbers (80 words)
- 🏃 Basic Actions (101 words)
- 🌦️ Nature & Weather (100 words)
- 🎨 Colors & Appearance (92 words)
- 👤 Body (59 words)
- 🍽️ Food & Drink (58 words)
- 🐾 Animals (52 words)
- 🎓 Work & Education (51 words)
- 🚗 Transportation (43 words)
- 😊 Emotions & Mental States (35 words)
- 🏠 Home & Living (31 words)

**Grammar Categories:**

- 📦 noun (3,394 words)
- 🎨 adjective (726 words)
- 🏃 verb (548 words)
- 🔗 preposition (11 words)

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

- ✅ **Semantic categorization** - 12 meaningful learning topics instead of random categories
- ✅ **Translation cleaning** - Removed 6.4% of poor/inflected entries
- ✅ **Proper difficulty levels** - CEFR-based beginner/intermediate/advanced with correct counts
- ✅ **Quality filtering** - Only categories with 10+ words shown
- ✅ **Authentic Finnish data** - Sourced from kaikki.org linguistic database
- ✅ **Removed API server complexity** - Direct JSON loading
- ✅ **Fixed category counts** - All 16 categories now display properly

## 📝 License

MIT License - Feel free to use for learning Finnish! 🇫🇮
