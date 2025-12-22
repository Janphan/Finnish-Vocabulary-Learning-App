# Finnish Vocabulary Learning App - Brief

A modern, interactive Finnish language learning application built with React and TypeScript, featuring **79 vocabulary words** with clean translations and Firebase Cloud integration.

## 📊 Dataset Overview

### Current Vocabulary Database

- **Source**: Processed backup translations with grammatical fixes
- **Size**: 79 Finnish vocabulary words
- **Processing**: Manual translation fixes to convert grammatical descriptions to proper English
- **Categories**: 1 category (general vocabulary)
- **Difficulty Levels**: All set to beginner level

### Data Structure

```json
{
  "id": "vocab-1117",
  "finnish": "sienne",
  "english": "would sit",
  "partOfSpeech": "verb",
  "difficulty": "beginner",
  "categoryId": "general",
  "examples": []
}
```

### Categories Include

- **Current**: General vocabulary (all words in one category)
- **Difficulty-based**: Beginner level (all words)

**Previous Categories (from original dataset):**

- **Semantic**: Family & People, Nature & Weather, Food & Drink, Animals, Transportation, etc.
- **Grammatical**: Noun, Verb, Adjective, Adverb, Pronoun, Preposition, etc.
- **Difficulty-based**: Beginner (A1-A2), Intermediate (B1-B2), Advanced (C1-C2)

## 🚀 Core Functions

### Learning Features

- **Interactive Vocabulary Swiper**: Card-based learning with swipe gestures
- **Category-based Learning**: Browse by semantic or grammatical categories
- **Difficulty Filtering**: Choose appropriate level (beginner/intermediate/advanced)
- **Pronunciation Guide**: Finnish phonetic transcriptions
- **Example Sentences**: AI-generated contextual examples
- **Progress Tracking**: Personal folder organization system

### User Experience

- **Bilingual Interface**: English ↔ Finnish language switching
- **Mobile-First Design**: Touch-optimized for smartphones
- **Offline-Ready**: Progressive Web App capabilities
- **Real-time Updates**: Live data synchronization with Firebase
- **Responsive Design**: Works on desktop, tablet, and mobile

### Data Management

- **Firebase Firestore**: Cloud-based vocabulary storage
- **Real-time Sync**: Instant updates across devices
- **Batch Operations**: Efficient data loading and updates
- **Search & Filter**: Fast vocabulary lookup by multiple criteria
- **Backup & Restore**: Automated data backup with version control

## 🛠 Tech Stack

### Frontend Framework

- **React 18.3.1** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Fast build tool and development server
- **React DOM 18.3.1** - DOM rendering library

### UI & Styling

- **Radix UI** - Headless UI components library
  - Accordion, Dialog, Dropdown Menu, Tabs, etc.
- **Tailwind CSS** (via tailwind-merge) - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Class Variance Authority** - Component variant management

### Backend & Database

- **Firebase 12.6.0** - Google's app development platform
  - **Firestore** - NoSQL document database
  - **Authentication** - User management system
  - **Hosting** - Static site deployment
- **Firebase Admin 13.6.0** - Server-side Firebase operations

### Development Tools

- **TypeScript 5.2.2** - Static type checking
- **@vitejs/plugin-react-swc** - Fast React refresh
- **Node.js** - Server-side JavaScript runtime
- **dotenv** - Environment variable management

### Data Processing

- **Wiktextract** - Dictionary data extraction
- **OpenAI GPT-4** - AI example generation
- **Claude AI** - Backup AI service
- **Custom Scripts** - Data cleaning and enhancement

### UI Components & Features

- **Embla Carousel React** - Touch-friendly carousels
- **React Hook Form** - Form state management
- **Recharts** - Data visualization charts
- **React Day Picker** - Date selection components
- **Sonner** - Toast notifications
- **Next Themes** - Dark/light mode support

### Mobile & PWA Features

- **Responsive Design** - Mobile-first approach
- **Touch Gestures** - Swipe navigation
- **Offline Support** - Service worker integration
- **App-like Experience** - PWA capabilities

## 📁 Project Structure

```
Finnish-Vocabulary-Learning-App/
├── src/
│   ├── components/          # React UI components
│   │   ├── VocabularySwiper.tsx
│   │   ├── CategoryList.tsx
│   │   └── FolderManager.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useFirestoreVocabulary.ts
│   │   └── useApiVocabulary.ts
│   ├── services/            # Firebase & API services
│   │   └── firebaseVocabulary.ts
│   └── App.tsx              # Main application component
├── public/                  # Static assets & data
│   ├── finnish-vocab-ai-enhanced.json
│   └── kaikki.org-dictionary-Finnish.jsonl
├── scripts/                 # Data processing scripts
│   ├── upload-to-firestore.js
│   ├── ai-example-generator.js
│   └── clean-translations.js
└── package.json             # Dependencies & scripts
```

## 🔧 Key Scripts

### Development

```bash
npm run dev              # Start development server
npm run build           # Build for production
```

### Data Management

```bash
npm run upload:firestore     # Upload vocabulary to Firebase
npm run setup:data          # Process raw dictionary data
```

### AI Enhancement

```bash
node scripts/ai-example-generator.js    # Generate AI examples
node scripts/clean-translations.js     # Clean vocabulary data
```

## 🌟 Key Features

### 1. Smart Learning System

- CEFR-aligned difficulty progression
- Category-based vocabulary organization
- Personal folder system for favorites
- Progress tracking and statistics

### 2. AI-Enhanced Content

- 4,400+ AI-generated example sentences
- Contextual translations
- Pronunciation guides
- Quality-assured vocabulary data

### 3. Modern Architecture

- Cloud-first data storage with Firebase
- Real-time synchronization
- Progressive Web App capabilities
- Scalable, maintainable codebase

### 4. Optimized Performance

- Lazy loading and code splitting
- Efficient Firebase queries
- Minimal bundle size
- Fast development workflow with Vite

## 🚀 Deployment

The application is optimized for modern deployment platforms:

- **Firebase Hosting** - Primary deployment target
- **Vercel/Netlify** - Alternative static hosting
- **Docker** - Containerized deployment option
- **PWA** - Installable web application

## 📈 Recent Updates

### Version 1.0.0 (November 2024)

- ✅ Complete Firebase Firestore integration
- ✅ Removed large JSON files for optimized deployment
- ✅ Enhanced AI-generated examples and translations
- ✅ Git repository optimization (reduced from 3.8GB to 800KB)
- ✅ Mobile-first responsive design
- ✅ Bilingual interface (English/Finnish)
- ✅ CEFR difficulty mapping system

### Technical Improvements

- Migrated from static JSON to Firebase Firestore
- Implemented real-time data synchronization
- Added comprehensive error handling
- Optimized for scalable deployment
- Enhanced data consistency and validation

---

**Built with ❤️ for Finnish language learners**
