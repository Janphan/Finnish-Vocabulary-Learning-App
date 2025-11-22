import { useState, useEffect } from 'react';
import { CategoryList } from './components/CategoryList';
import { VocabularySwiper } from './components/VocabularySwiper';
import { FolderManager } from './components/FolderManager';
import { Folder, ArrowLeft, Globe } from 'lucide-react';
// Use Firestore for vocabulary data instead of JSON files
import { useFirestoreVocabulary } from './hooks/useFirestoreVocabulary';

// Language translations
const translations = {
  en: {
    title: "Finnish Vocabulary",
    words: "words",
    chooseLevel: "Choose level:",
    allLevels: "All Levels",
    basicLevel: "Basic Level", 
    intermediateLevel: "Intermediate Level",
    advancedLevel: "Advanced Level",
    myFolders: "My Folders",
    organizeVocabulary: "Organize your vocabulary",
    loading: "Loading Finnish",
    gettingVocabulary: "Getting vocabulary...",
    almostReady: "Almost ready...",
    wordsLoaded: "words loaded!",
    connectionError: "Connection error"
  },
  fi: {
    title: "Suomen sanasto",
    words: "sanaa",
    chooseLevel: "Valitse taso:",
    allLevels: "Kaikki tasot",
    basicLevel: "Alkeistaso",
    intermediateLevel: "Keskitaso", 
    advancedLevel: "Edistynyt taso",
    myFolders: "Omat kansiot",
    organizeVocabulary: "Järjestä sanastosi",
    loading: "Ladataan suomea",
    gettingVocabulary: "Haetaan sanastoa...",
    almostReady: "Melkein valmis...",
    wordsLoaded: "sanaa ladattu!",
    connectionError: "Yhteysvirhe"
  }
};

// Category name translations
const categoryTranslations = {
  en: {
    // Semantic categories
    'Family & People': 'Family & People',
    'Time & Numbers': 'Time & Numbers', 
    'Basic Actions': 'Basic Actions',
    'Nature & Weather': 'Nature & Weather',
    'Colors & Appearance': 'Colors & Appearance',
    'Body': 'Body',
    'Food & Drink': 'Food & Drink',
    'Animals': 'Animals',
    'Work & Education': 'Work & Education',
    'Transportation': 'Transportation',
    'Emotions & Mental States': 'Emotions & Mental States',
    'Home & Living': 'Home & Living',
    
    // Grammar categories (lowercase - from data)
    'noun': 'Noun',
    'verb': 'Verb',
    'adjective': 'Adjective',
    'adverb': 'Adverb',
    'pronoun': 'Pronoun',
    'proper_noun': 'Proper Noun',
    'preposition': 'Preposition',
    'interjection': 'Interjection',
    
    // Grammar categories (capitalized - from useApiVocabulary)  
    'Noun': 'Noun',
    'Verb': 'Verb',
    'Adjective': 'Adjective',
    'Adverb': 'Adverb',
    'Pronoun': 'Pronoun',
    'Proper_noun': 'Proper Noun',
    'Preposition': 'Preposition',
    'Interjection': 'Interjection',
    
    // Legacy categories
    'greetings': 'Greetings',
    'numbers': 'Numbers',
    'food': 'Food',
    'colors': 'Colors',
    'family': 'Family',
    'weather': 'Weather',
    'body': 'Body',
    'animals': 'Animals',
    'clothing': 'Clothing',
    'transportation': 'Transportation',
    'time': 'Time',
    'home': 'Home',
    'work': 'Work',
    'emotions': 'Emotions',
    'actions': 'Actions',
    'adjectives': 'Adjectives',
    'general': 'General'
  },
  fi: {
    // Semantic categories
    'Family & People': 'Perhe & Ihmiset',
    'Time & Numbers': 'Aika & Numerot',
    'Basic Actions': 'Perustoiminnot', 
    'Nature & Weather': 'Luonto & Sää',
    'Colors & Appearance': 'Värit & Ulkonäkö',
    'Body': 'Keho',
    'Food & Drink': 'Ruoka & Juoma',
    'Animals': 'Eläimet',
    'Work & Education': 'Työ & Koulutus',
    'Transportation': 'Liikenne',
    'Emotions & Mental States': 'Tunteet & Mielentilat',
    'Home & Living': 'Koti & Asuminen',
    
    // Grammar categories (lowercase - from data)
    'noun': 'Substantiivi',
    'verb': 'Verbi', 
    'adjective': 'Adjektiivi',
    'adverb': 'Adverbi',
    'pronoun': 'Pronomini',
    'proper_noun': 'Erisnimi',
    'preposition': 'Prepositio',
    'interjection': 'Huudahdus',
    
    // Grammar categories (capitalized - from useApiVocabulary)
    'Noun': 'Substantiivi',
    'Verb': 'Verbi',
    'Adjective': 'Adjektiivi', 
    'Adverb': 'Adverbi',
    'Pronoun': 'Pronomini',
    'Proper_noun': 'Erisnimi',
    'Preposition': 'Prepositio',
    'Interjection': 'Huudahdus',
    
    // Legacy categories
    'greetings': 'Tervehdykset',
    'numbers': 'Numerot',
    'food': 'Ruoka',
    'colors': 'Värit',
    'family': 'Perhe',
    'weather': 'Sää',
    'body': 'Keho',
    'animals': 'Eläimet', 
    'clothing': 'Vaatteet',
    'transportation': 'Liikenne',
    'time': 'Aika',
    'home': 'Koti',
    'work': 'Työ',
    'emotions': 'Tunteet',
    'actions': 'Toiminnot',
    'adjectives': 'Adjektiivit',
    'general': 'Yleinen'
  }
};

type Language = 'en' | 'fi';

export interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  partOfSpeech?: string;
  categories: string[]; // Array of category IDs this word belongs to
  cefr?: string; // CEFR level (A1, A2, B1, B2, C1, C2)
  pronunciation?: string;
  audio?: string | null;
  examples?: string[];
  difficultyScore?: number;
  frequency?: number;
  example?: string;
  aiGenerated?: boolean; // True if example was generated by AI
  generatedAt?: string;
  aiService?: string | null; // Which AI service was used (openai, gemini, claude, etc.)
  // Computed fields (added by upload script or app logic)
  categoryId?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Computed from CEFR or difficultyScore
  fallbackUsed?: boolean; // True if fallback example was used
}

export interface Category {
  id: string;
  name: string;
  count: number;
  emoji?: string;
  description?: string;
}

export interface UserFolder {
  id: string;
  name: string;
  wordIds: string[];
}

type View = 'categories' | 'vocabulary' | 'folders' | 'loading';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('loading');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  
  // Get current translations
  const t = translations[language];
  
  // Use Firestore for vocabulary data instead of JSON files
  const { 
    words: allWords, 
    categories, 
    loading, 
    error
  } = useFirestoreVocabulary({
    // Don't limit pageSize - we want all vocabulary for proper difficulty counts
  });
  
  // Switch to categories view when API data is ready (but don't override vocabulary view)
  useEffect(() => {
    if (!loading && categories.length > 0 && currentView === 'loading') {
      setCurrentView('categories');
    }
  }, [loading, allWords, categories, currentView]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('vocabulary');
  };

  const handleBack = () => {
    setCurrentView('categories');
    setSelectedCategoryId(null);
  };

  const handleToggleFavorite = (wordId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(wordId)) {
        newFavorites.delete(wordId);
      } else {
        newFavorites.add(wordId);
      }
      return newFavorites;
    });
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: UserFolder = {
      id: Date.now().toString(),
      name,
      wordIds: [],
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  const handleAddToFolder = (wordId: string, folderId: string) => {
    setFolders((prev) =>
      prev.map((folder) => {
        if (folder.id === folderId) {
          if (folder.wordIds.includes(wordId)) {
            return {
              ...folder,
              wordIds: folder.wordIds.filter((id) => id !== wordId),
            };
          } else {
            return {
              ...folder,
              wordIds: [...folder.wordIds, wordId],
            };
          }
        }
        return folder;
      })
    );
  };

  const getCategoryWords = (categoryId: string) => {
    let categoryWords = allWords.filter((word: VocabularyWord) => {
      const hasCategories = word.categories && Array.isArray(word.categories);
      const includesCategory = hasCategories ? word.categories.includes(categoryId) : false;
      const matchesCategoryId = word.categoryId === categoryId;
      
      return includesCategory || matchesCategoryId;
    });
    
    // Filter by difficulty level if not 'all'
    if (selectedDifficulty !== 'all') {
      categoryWords = categoryWords.filter((word: VocabularyWord) => word.difficulty === selectedDifficulty);
    }
    
    return categoryWords;
  };

  const selectedCategory = categories.find((c: Category) => c.id === selectedCategoryId);

  // Loading state
  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.loading}</h2>
          <p className="text-sm text-gray-600 mb-6">
            {loading ? t.gettingVocabulary : t.almostReady}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1 mb-6">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          {allWords.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 transform transition-all duration-500 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <span className="text-lg">✨</span>
                <p className="font-medium">
                  {allWords.length} {t.wordsLoaded}
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-red-700">
                <span>⚠️</span>
                <p className="text-sm">{t.connectionError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {currentView === 'categories' && (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-md mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {t.title}
                  </h1>
                  <p className="text-xs text-gray-600">{allWords.length} {t.words}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Switcher */}
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'fi' : 'en')}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                    title={language === 'en' ? 'Suomeksi' : 'In English'}
                  >
                    <Globe className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                  </button>
                  <button
                    onClick={() => setCurrentView('folders')}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                    title="My Folders"
                  >
                    <Folder className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                  </button>

                </div>
              </div>
              
              {/* Difficulty Level Selector */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  {t.chooseLevel}
                </p>
                <div className="relative">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'all')}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-white text-gray-800 border-2 border-gray-300 focus:border-green-500 focus:bg-green-50 focus:text-green-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{ 
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none'
                    }}
                  >
                    <option value="all">🌟 {t.allLevels}</option>
                    <option value="beginner">🌱 {t.basicLevel}</option>
                    <option value="intermediate">⭐ {t.intermediateLevel}</option>
                    <option value="advanced">🚀 {t.advancedLevel}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <CategoryList
            categories={categories}
            vocabularyWords={allWords}
            onSelectCategory={handleCategorySelect}
            selectedDifficulty={selectedDifficulty}
            language={language}
            categoryTranslations={categoryTranslations}
          />
        </>
      )}

      {currentView === 'vocabulary' && selectedCategory && (
        <VocabularySwiper
          words={getCategoryWords(selectedCategory.id)}
          favorites={favorites}
          folders={folders}
          onToggleFavorite={handleToggleFavorite}
          onAddToFolder={handleAddToFolder}
          onBack={handleBack}
          language={language}
        />
      )}

      {currentView === 'folders' && (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-gray-900">{t.myFolders}</h1>
                  <p className="text-gray-500 text-sm">{t.organizeVocabulary}</p>
                </div>
              </div>
            </div>
          </div>
          <FolderManager
            folders={folders}
            favorites={favorites}
            vocabularyWords={allWords}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </>
      )}


    </div>
  );
}