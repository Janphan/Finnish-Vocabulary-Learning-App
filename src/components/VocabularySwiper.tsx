import { useState, useRef, useEffect } from 'react';
import { VocabularyWord, UserFolder } from '../App';
import { Star, FolderPlus, ArrowLeft, Volume2 } from 'lucide-react';
import { AddToFolderModal } from './AddToFolderModal';

interface VocabularySwiperProps {
  words: VocabularyWord[];
  favorites: Set<string>;
  folders: UserFolder[];
  onToggleFavorite: (wordId: string) => void;
  onAddToFolder: (wordId: string, folderId: string) => void;
  onBack: () => void;
  language?: 'en' | 'fi';
}

export function VocabularySwiper({
  words,
  favorites,
  folders,
  onToggleFavorite,
  onAddToFolder,
  onBack,
  language = 'en',
}: VocabularySwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWord = words[currentIndex];
  
  // Language labels
  const labels = {
    en: { finnish: 'Finnish', english: 'English', example: 'Example' },
    fi: { finnish: 'Suomi', english: 'Englanti', example: 'Esimerkki' }
  };
  
  // Calculate if current word is favorite
  const isFavorite = favorites.has(currentWord?.id || '');
  
  // Safety check - if no current word, don't render
  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No vocabulary words available for this category</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 inline-block mr-2" />
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe up - next word
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe down - previous word
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = () => {
    // Generate random index that's different from current
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * words.length);
    } while (randomIndex === currentIndex && words.length > 1);
    setCurrentIndex(randomIndex);
  };

  const handlePrevious = () => {
    // Generate random index that's different from current
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * words.length);
    } while (randomIndex === currentIndex && words.length > 1);
    setCurrentIndex(randomIndex);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      handleNext();
    } else if (e.key === 'ArrowDown') {
      handlePrevious();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, words.length]);

  return (
    <>
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* Minimal Header Actions */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="text-gray-400 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            {currentIndex + 1} / {words.length}
          </div>
        </div>

        {/* Main Content - Full Screen */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center px-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full max-w-md space-y-8">
            {/* Finnish Word */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-3">{labels[language].finnish}</div>
              <h2 className="text-gray-900 text-6xl mb-4">{currentWord.finnish}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Volume2 className="w-4 h-4" />
                <span>{currentWord.pronunciation}</span>
                <span className="text-gray-400">({currentWord.partOfSpeech})</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 max-w-xs mx-auto"></div>

            {/* English Translation */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">{labels[language].english}</div>
              <div className="text-gray-900 text-3xl">{currentWord.english}</div>
            </div>

            {/* Example Sentence */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">{labels[language].example}</div>
              <div className="text-gray-600 italic max-w-sm mx-auto leading-relaxed">
                {currentWord.example}
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4">
          <button
            onClick={() => onToggleFavorite(currentWord.id)}
            className={`p-3 rounded-full transition-all active:scale-90 shadow-sm backdrop-blur-sm ${
              isFavorite
                ? 'bg-yellow-400/90 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Star
              className="w-5 h-5"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>

          <button
            onClick={() => setShowFolderModal(true)}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-all active:scale-90 shadow-sm"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFolderModal && (
        <AddToFolderModal
          word={currentWord}
          folders={folders}
          onAddToFolder={onAddToFolder}
          onClose={() => setShowFolderModal(false)}
        />
      )}
    </>
  );
}
