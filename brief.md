# Finnish Vocabulary Learning App - Brief

A modern, interactive Finnish language learning application built with React and TypeScript, featuring **demo data with 20 sample vocabulary words** and Firebase Cloud integration for custom vocabulary uploads.

## 📊 Dataset Overview

### Demo Data Included

- **Size**: 20 sample Finnish vocabulary words
- **Categories**: Animals, Food, Family, Education, and more
- **Difficulty Levels**: Beginner and Intermediate
- **Features**: Example sentences and proper translations
- **Extensible**: Full data schema documented for custom vocabulary uploads

### Data Structure

```json
{
  "id": "sample-1",
  "finnish": "koira",
  "english": "dog",
  "partOfSpeech": "noun",
  "difficulty": "beginner",
  "categoryId": "animals",
  "examples": ["Minulla on koira.", "Koira haukkuu."]
}
```

### Categories Include

- **Animals**: koira (dog), kissa (cat), lehmä (cow)
- **Food**: syödä (to eat), juoda (to drink), vesi (water)
- **Family**: äiti (mother), isä (father)
- **Education**: kirja (book), koulu (school), opiskella (to study)
- **Descriptions**: iso (big), pieni (small), kaunis (beautiful)
- **And more**: Travel, emotions, actions, etc.

**Difficulty Levels:**
- **Beginner**: Basic vocabulary (14 words)
- **Intermediate**: Advanced terms (6 words)

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
