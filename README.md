# Finnish Vocabulary Learning App

A modern, interactive vocabulary learning application for Finnish language learners built with React, TypeScript, and Vite.

## ✨ Features

- **111,000+ Finnish vocabulary words** extracted from authentic linguistic data
- **Category-based learning** (actions, descriptions, food, animals, etc.)
- **Interactive flashcards** with swipe gestures
- **Pronunciation guide** with IPA notation
- **Real Finnish examples** showing words in context
- **Difficulty levels** for progressive learning
- **Responsive design** works on desktop and mobile

## 🏗️ Architecture

**Simple and Clean:**

- **React frontend** - Single-page application
- **Direct JSON loading** - No API server needed
- **Static data** - Vocabulary loaded from JSON files
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
└── extracted-finnish-vocab.json  # 111k vocabulary words

scripts/
└── extract-vocabulary.js         # Data processing utilities
```

## 📊 Data Quality

- **111,295 vocabulary words** from kaikki.org dictionary
- **Authentic Finnish** - Filtered to exclude borrowed words and morphemes
- **Linguistic accuracy** - Part-of-speech tags and pronunciations
- **Learning-focused** - Curated for vocabulary acquisition

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

**Add vocabulary:**

1. Edit `public/extracted-finnish-vocab.json`
2. Refresh the app - changes appear immediately

**Modify categories:**

1. Update the `categoryEmojiMap` in `useApiVocabulary.ts`
2. Add new category logic as needed

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

- ✅ **Removed API server complexity** - Direct JSON loading
- ✅ **Fixed Finnish examples** - Real sentences instead of translations
- ✅ **Filtered partial words** - No more "-laatuisuus" compound endings
- ✅ **Improved data quality** - 111k clean vocabulary words
- ✅ **Simplified architecture** - One server instead of two

## 📝 License

MIT License - Feel free to use for learning Finnish! 🇫🇮
