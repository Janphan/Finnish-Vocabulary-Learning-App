# Finnish Vocabulary Learning App

A modern, interactive React application designed to help users learn Finnish vocabulary through an engaging swipe-based interface. The app features categorized vocabulary, pronunciation guides, example sentences, and personal organization tools.

## 🎯 Purpose

This application serves as a comprehensive Finnish language learning tool that:

- Helps beginners learn essential Finnish vocabulary
- Provides pronunciation guidance for each word
- Offers contextual examples to understand word usage
- Allows personalized vocabulary organization through folders
- Makes learning interactive and engaging through a card-swipe interface

## ✨ Features

### 🏷️ **Categorized Vocabulary**

- **6 main categories**: Greetings, Numbers, Food, Colors, Family, Weather
- **48+ vocabulary words** with Finnish-English translations
- Each category includes emoji icons for visual recognition

### 🗂️ **Interactive Learning Interface**

- **Swipe-based cards** for intuitive vocabulary browsing
- **Touch/mouse navigation** with smooth animations
- **Card flipping** to reveal translations and details
- **Audio pronunciation** guides (visual indicators included)

### 📝 **Comprehensive Word Information**

- **Finnish word** with proper spelling
- **English translation**
- **Phonetic pronunciation** guide
- **Example sentences** in Finnish with English translations
- **Category grouping** for organized learning

### 📁 **Personal Organization Tools**

- **Custom folders** to organize vocabulary by personal preferences
- **Favorites system** to mark important words
- **Add/remove words** from personal collections
- **Folder management** with create/delete functionality

### 🎨 **Modern UI/UX**

- **Responsive design** that works on desktop and mobile
- **Clean, intuitive interface** built with Tailwind CSS
- **Smooth animations** and transitions
- **Accessibility-friendly** design patterns

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useRef, useEffect)
- **Touch Gestures**: Custom swipe detection
- **Development**: Hot Module Replacement with Vite

## 🚀 Project Setup

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Janphan/Finnish-Vocabulary-Learning-App.git
   cd "Finnish Vocabulary Learning App"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📱 How to Use

### 1. **Browse Categories**

- Start from the main screen showing 6 vocabulary categories
- Each category displays an emoji and shows the number of words
- Tap any category to enter the vocabulary learning mode

### 2. **Learn Vocabulary**

- **Swipe left/right** or use navigation buttons to browse words
- **Tap the card** to flip and see translation details
- **Star icon** to add words to favorites
- **Folder icon** to add words to custom folders
- **Volume icon** for pronunciation guidance (visual indicator)

### 3. **Organize Your Learning**

- **Access folders** via the folder icon in the header
- **Create custom folders** to group words by themes, difficulty, or learning goals
- **Manage your collection** by adding/removing words from folders
- **Track favorites** across all categories

## 🎓 Learning Approach

The app is designed with language learning best practices:

- **Spaced repetition** through easy revisiting of categorized words
- **Contextual learning** with example sentences
- **Multi-sensory input** combining visual, auditory (pronunciation), and textual information
- **Personal relevance** through custom folder organization
- **Progressive difficulty** from basic greetings to more complex vocabulary

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # UI primitives (buttons, cards, etc.)
│   ├── CategoryList.tsx # Category selection screen
│   ├── VocabularySwiper.tsx # Main learning interface
│   ├── FolderManager.tsx # Personal organization tools
│   └── AddToFolderModal.tsx # Folder selection modal
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── styles/            # Global styles and Tailwind config
```

### Key Dependencies

- **@radix-ui/**: Accessible, unstyled UI primitives
- **lucide-react**: Beautiful, customizable icons
- **class-variance-authority**: Type-safe styling variants
- **tailwind-merge**: Intelligent Tailwind class merging

## 🎨 Design Credits

This project is based on the original Figma design available at: https://www.figma.com

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Finnish Learning! 🇫🇮**
