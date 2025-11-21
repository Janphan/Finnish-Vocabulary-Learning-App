# 🇫🇮 Finnish Vocabulary Learning App

A modern, interactive web application for learning Finnish vocabulary with Firebase backend. Learn over **250+ Finnish words** across **11 categories** with pronunciation guides, example sentences, and difficulty levels.

![Finnish Learning App](https://img.shields.io/badge/Words-253+-blue) ![Categories](https://img.shields.io/badge/Categories-11-green) ![Firebase](https://img.shields.io/badge/Firebase-Powered-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Features

🎯 **Comprehensive Vocabulary**

- **253+ Finnish words** with English translations
- **11 thematic categories**: Greetings, Family, Animals, Food & Drinks, Colors, Body Parts, Weather, Transportation, Clothing, School & Education, Home
- **Pronunciation guides** for every word (phonetic spelling)
- **Example sentences** in context
- **Difficulty levels** (beginner/intermediate)
- **Frequency ratings** for practical learning

🚀 **Interactive Learning**

- **Swipe-based interface** for engaging vocabulary practice
- **Real-time Firebase sync** for seamless experience
- **Responsive design** works perfectly on desktop and mobile
- **Search & filter** to find specific words
- **Custom folders** to organize your learning

📱 **Mobile-First Design**

- Access via local network on any device
- Touch-friendly swipe gestures
- Optimized for smartphones and tablets

## 🚀 Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/Janphan/Finnish-Vocabulary-Learning-App.git
   cd Finnish-Vocabulary-Learning-App
   npm install
   ```

2. **Configure Firebase** (Required)

   ```bash
   # Create .env file with your Firebase config
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Seed Database** (One-time setup)

   ```bash
   node src/database/seed-firebase.js
   ```

   ✅ This uploads all 253 vocabulary words to your Firebase database

4. **Start Development**
   ```bash
   npm run dev
   ```
   🌐 Access at `http://localhost:3000` or your network IP for mobile testing

## 📁 Project Structure

```
src/
├── App.tsx                          # Main application component & data flow controller
├── main.tsx                        # React application entry point
├── index.css                       # Global styles & CSS imports
├── components/                     # React UI components
│   ├── CategoryList.tsx           # Category grid with dynamic word counts
│   ├── VocabularySwiper.tsx       # Interactive word learning cards
│   ├── FolderManager.tsx          # User vocabulary collections
│   ├── AddToFolderModal.tsx       # Modal for organizing words
│   ├── figma/                     # Image components
│   │   └── ImageWithFallback.tsx  # Fallback image handler
│   └── ui/                        # Reusable shadcn/ui components
│       ├── button.tsx, card.tsx   # Core UI primitives
│       ├── dialog.tsx, input.tsx  # Form & modal components
│       ├── tabs.tsx, tooltip.tsx  # Navigation & info components
│       └── [20+ more components]  # Complete UI component library
├── database/                      # 🔥 Firebase integration & data layer
│   ├── index.ts                   # Centralized database exports
│   ├── firebase.ts                # Firebase config & initialization
│   ├── firebaseVocabularyService.ts  # Complete CRUD operations & queries
│   ├── useFirebaseVocabulary.ts   # React hooks for data management
│   └── seed-firebase.js           # 📊 Database seeding (133 words + 11 categories)
├── guidelines/                    # Development documentation
│   └── Guidelines.md              # Project development guidelines
└── styles/
    └── globals.css                # Tailwind CSS configuration & custom styles
```

## 🛠️ Tech Stack

- **⚛️ Frontend**: React 18.3.1 + TypeScript + Vite 6.3.5
- **🔥 Backend**: Firebase Firestore (NoSQL cloud database)
- **🎨 UI Framework**: Tailwind CSS + shadcn/ui component library
- **📱 Icons**: Lucide React (beautiful icon system)
- **🔄 State Management**: React Hooks + Firebase real-time synchronization
- **📦 Build Tool**: Vite (lightning-fast development & optimized production builds)
- **🔧 Development**: TypeScript for type safety, ESLint for code quality

## 📊 Architecture Overview

### **Data Flow**

```
🔥 Firebase Firestore ← 🔄 Service Layer ← 🎣 React Hooks ← 📱 Components
```

### **Key Components**

- **`firebaseVocabularyService.ts`**: Core data operations (CRUD, search, pagination)
- **`useFirebaseVocabulary.ts`**: React hooks for state management & data fetching
- **`App.tsx`**: Main controller managing data flow & view switching
- **`CategoryList.tsx`**: Dynamic category grid with real word counts
- **`VocabularySwiper.tsx`**: Interactive learning cards with pronunciation guides

### **Database Schema**

- **`vocabulary` collection**: 133 Finnish words with translations, pronunciation, examples
- **`categories` collection**: 11 thematic categories with metadata & word counts
- **Real-time sync**: Changes instantly reflected across all connected devices## 📚 Vocabulary Categories

| Category           | Count    | Emoji | Description                             |
| ------------------ | -------- | ----- | --------------------------------------- |
| Greetings          | 10 words | 👋    | Common greetings and polite expressions |
| Family             | 12 words | 👨‍👩‍👧‍👦    | Family members and relationships        |
| Animals            | 15 words | 🐕    | Common animals and pets                 |
| Food & Drinks      | 18 words | 🍽️    | Food, beverages, and meals              |
| Colors             | 12 words | 🎨    | Basic colors and shades                 |
| Body Parts         | 15 words | 👤    | Human anatomy vocabulary                |
| Weather            | 12 words | 🌤️    | Weather conditions and climate          |
| Transportation     | 12 words | 🚗    | Vehicles and travel methods             |
| Clothing           | 12 words | 👕    | Clothes and accessories                 |
| School & Education | 10 words | 📚    | Learning and academic terms             |
| Home               | 5 words  | 🏠    | House, rooms, and furniture             |

**Total: 133 unique Finnish vocabulary words** 🇫🇮

## 🚀 Data Seeding & Architecture

### **Database Seeding Process**

```bash
node src/database/seed-firebase.js
```

This one-time setup script:

1. **🧹 Cleans existing data** to prevent duplicates
2. **📚 Uploads 133 vocabulary words** with complete metadata
3. **📂 Creates 11 categories** with accurate word counts
4. **✅ Validates data integrity** and reports success

### **Data Structure & Flow**

```
📄 Seed Script → 🔥 Firebase Firestore → 🎣 React Hooks → 📱 App Components
```

Each vocabulary word includes:

- **Translations**: English ↔ Finnish with context
- **Pronunciation**: Phonetic spelling guides (e.g., "kis-sa")
- **Examples**: Real usage sentences in Finnish
- **Metadata**: Part of speech, difficulty (beginner/intermediate), frequency rating
- **Categories**: Thematic organization (supports multiple categories per word)

### **Key Technical Features**

- **🔄 Real-time sync**: Firebase Firestore updates instantly across devices
- **📊 Dynamic counting**: Category word counts calculated from actual data
- **🔍 Smart filtering**: Words filtered by category array for accurate results
- **⚡ Performance**: Dual loading strategy (paginated + full dataset)
- **🛡️ Type safety**: Full TypeScript interfaces for data integrity

## 🔧 Development Commands

```bash
# Start development server
npm run dev              # → http://localhost:3000

# Build for production
npm run build            # Creates optimized dist/ folder

# Preview production build
npm run preview          # Test production build locally

# Database operations
node src/database/seed-firebase.js  # Upload vocabulary to Firebase
node check-firebase.js              # Check current database content
```

## 🌐 Mobile Testing

Your app supports mobile testing via local network:

1. **Find your local IP**: Check terminal output when running `npm run dev`
2. **Access on mobile**: `http://YOUR_IP:3000` (e.g., `http://192.168.1.103:3000`)
3. **Same WiFi required**: Ensure mobile device is on same network

## 🔐 Firebase Security

- Environment variables protect sensitive Firebase config
- Firestore security rules control database access
- API keys are excluded from version control (.gitignore)
- Production-ready authentication can be added later

## 📈 Performance

- **⚡ Vite**: Ultra-fast development with hot module replacement
- **🔥 Firebase**: Serverless backend scales automatically
- **📱 Responsive**: Optimized for all screen sizes
- **⚛️ React**: Component-based architecture for maintainability

## 🚀 Deployment Options

- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Continuous deployment from Git
- **Firebase Hosting**: Integrated hosting with Firebase backend
- **GitHub Pages**: Free static hosting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Finnish vocabulary sourced from educational resources
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Backend by [Firebase](https://firebase.google.com/)

---

**Start learning Finnish today!** 🇫🇮 ✨
