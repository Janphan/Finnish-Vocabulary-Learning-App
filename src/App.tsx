import { useState, useEffect } from 'react';
import { CategoryList } from './components/CategoryList';
import { VocabularySwiper } from './components/VocabularySwiper';
import { FolderManager } from './components/FolderManager';
import { Folder, ArrowLeft, RefreshCw } from 'lucide-react';
// Use API server for vocabulary data
import { useApiVocabulary } from './hooks/useApiVocabulary';

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
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // Made required for filtering
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<UserFolder[]>([]);
  
  // Use API server for vocabulary data
  const { 
    words: allWords, 
    categories, 
    loading, 
    error
  } = useApiVocabulary({
    pageSize: 1500 // Get all words
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
        <div className="text-center max-w-md mx-auto px-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Loading Finnish Vocabulary</h2>
          
          <p className="text-gray-600 text-sm">
            {loading ? 'Loading vocabulary...' : 'Preparing vocabulary...'}
          </p>
          
          <div className="mt-2 text-xs text-gray-500">
            Debug: Loading={loading ? 'yes' : 'no'}, 
            Words={allWords.length}, Categories={categories.length}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">Error: {error}</p>
              <p className="text-red-600 text-xs mt-1">
                Make sure Firebase is configured and contains vocabulary data
              </p>
            </div>
          )}
          
          {allWords.length > 0 && (
            <p className="text-green-600 text-sm mt-2">
              🎉 Loaded {allWords.length} vocabulary words from API!
            </p>
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
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-gray-900">Finnish Vocabulary</h1>
                  <p className="text-gray-500 text-sm">Choose a category • {allWords.length} words loaded</p>
                </div>
                <button
                  onClick={() => setCurrentView('folders')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Folder className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              {/* Difficulty Level Selector */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Difficulty Level:</p>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All Levels', count: allWords.length },
                    { value: 'beginner', label: 'Beginner', count: allWords.filter((w: VocabularyWord) => w.difficulty === 'beginner').length },
                    { value: 'intermediate', label: 'Intermediate', count: allWords.filter((w: VocabularyWord) => w.difficulty === 'intermediate').length },
                    { value: 'advanced', label: 'Advanced', count: allWords.filter((w: VocabularyWord) => w.difficulty === 'advanced').length }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedDifficulty(level.value as 'beginner' | 'intermediate' | 'advanced' | 'all')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDifficulty === level.value
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      <div>{level.label}</div>
                      <div className="text-xs opacity-75">{level.count} words</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <CategoryList
            categories={categories}
            vocabularyWords={allWords}
            onSelectCategory={handleCategorySelect}
            selectedDifficulty={selectedDifficulty}
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
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            vocabularyWords={allWords}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </>
      )}
    </div>
  );
}