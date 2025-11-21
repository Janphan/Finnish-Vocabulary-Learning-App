import { useState, useEffect } from 'react';
import { CategoryList } from './components/CategoryList';
import { VocabularySwiper } from './components/VocabularySwiper';
import { FolderManager } from './components/FolderManager';
import { Folder, ArrowLeft, RefreshCw } from 'lucide-react';
// Use Firebase for production-ready data management
import { useFirebaseVocabulary, useFirebaseCategories, useFirebaseConnection, useAllVocabularyWords } from './database';

export interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  categoryId: string;
  categories: string[]; // Array of category IDs this word belongs to
  pronunciation: string;
  example: string;
  partOfSpeech?: string;
  examples?: string[];
  difficulty?: string;
  frequency?: number;
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<UserFolder[]>([]);
  
  // Use Firebase for scalable, production-ready vocabulary data
  const { words, isLoading, error } = useFirebaseVocabulary({ autoLoad: true });
  const { categories, isLoading: categoriesLoading } = useFirebaseCategories();
  const { isConnected } = useFirebaseConnection();
  
  // Load ALL vocabulary words for accurate category counting
  const { words: allWords, isLoading: allWordsLoading } = useAllVocabularyWords();
  
  // Switch to categories view when Firebase data is ready
  useEffect(() => {
    console.log('🔍 Loading state check:', {
      isLoading,
      categoriesLoading,
      allWordsLoading,
      wordsLength: words.length,
      allWordsLength: allWords.length,
      categories: categories.length,
      isConnected
    });
    
    if (!isLoading && !categoriesLoading && !allWordsLoading && allWords.length > 0) {
      console.log('✅ Switching to categories view');
      setCurrentView('categories');
    }
  }, [isLoading, categoriesLoading, allWordsLoading, words, allWords, categories, isConnected]);
  
  // Show connection status
  useEffect(() => {
    if (isConnected === false) {
      console.warn('❌ Firebase connection failed - check your configuration');
    } else if (isConnected === true) {
      console.log('✅ Firebase connected successfully');
    }
  }, [isConnected]);

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
    return allWords.filter((word: VocabularyWord) => 
      word.categories && word.categories.includes(categoryId)
    );
  };

  const selectedCategory = categories.find((c: Category) => c.id === selectedCategoryId);

  // Loading state
  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Loading Finnish Vocabulary</h2>
          
          {/* Firebase connection status */}
          {isConnected === null && (
            <p className="text-gray-600 text-sm mb-2">🔗 Connecting to Firebase...</p>
          )}
          {isConnected === false && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">⚠️ Firebase connection failed</p>
              <p className="text-yellow-700 text-xs mt-1">Check your Firebase configuration in .env file</p>
            </div>
          )}
          {isConnected === true && (
            <p className="text-green-600 text-sm mb-2">✅ Connected to Firebase</p>
          )}
          
          <p className="text-gray-600 text-sm">
            {isLoading || categoriesLoading ? 'Loading vocabulary from Firebase...' : 'Preparing vocabulary...'}
          </p>
          
          <div className="mt-2 text-xs text-gray-500">
            Debug: Loading={isLoading ? 'yes' : 'no'}, Categories={categoriesLoading ? 'loading' : 'ready'}, 
            Words={words.length}, Categories={categories.length}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">Error: {error}</p>
              <p className="text-red-600 text-xs mt-1">
                Make sure Firebase is configured and contains vocabulary data
              </p>
            </div>
          )}
          
          {words.length > 0 && (
            <p className="text-green-600 text-sm mt-2">
              🎉 Loaded {words.length} vocabulary words from Firebase!
            </p>
          )}
          
          {isConnected === false && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left">
              <p className="text-blue-800 text-sm font-medium">Need to setup Firebase?</p>
              <p className="text-blue-700 text-xs mt-1">
                1. Follow FIREBASE_SETUP.md<br/>
                2. Add your config to .env file<br/>
                3. Upload vocabulary data
              </p>
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
                  <h1 className="text-gray-900">Finnish Vocabulary</h1>
                  <p className="text-gray-500 text-sm">Choose a category • {words.length} words loaded</p>
                </div>
                <button
                  onClick={() => setCurrentView('folders')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Folder className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
          <CategoryList
            categories={categories}
            vocabularyWords={allWords}
            onSelectCategory={handleCategorySelect}
          />
        </>
      )}

      {currentView === 'vocabulary' && selectedCategory && (
        <VocabularySwiper
          words={getCategoryWords(selectedCategory.id)}
          category={selectedCategory}
          favorites={favorites}
          folders={folders}
          onToggleFavorite={handleToggleFavorite}
          onAddToFolder={handleAddToFolder}
          onBack={handleBack}
        />
      )}

      {currentView === 'folders' && (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-md mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('categories')}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-gray-900">My Folders</h1>
                  <p className="text-gray-500 text-sm">Organize your vocabulary</p>
                </div>
              </div>
            </div>
          </div>
          <FolderManager
            folders={folders}
            favorites={favorites}
            vocabularyWords={words}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </>
      )}
    </div>
  );
}