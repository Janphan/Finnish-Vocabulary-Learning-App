import { Category, VocabularyWord } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryListProps {
  categories: Category[];
  vocabularyWords: VocabularyWord[];
  onSelectCategory: (categoryId: string) => void;
  selectedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

const categoryImages: Record<string, string> = {
  greetings: 'https://images.unsplash.com/photo-1737569943524-8edf753c4e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVldGluZyUyMGhhbmRzaGFrZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYzNjY2MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  numbers: 'https://images.unsplash.com/photo-1666071083297-601c9b0701a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1iZXJzJTIwbWF0aGVtYXRpY3MlMjBtaW5pbWFsfGVufDF8fHx8MTc2MzY2NjIyMXww&ixlib=rb-4.1.0&q=80&w=1080',
  food: 'https://images.unsplash.com/photo-1547825407-6d03f5aa43dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwTm9yZGljJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MzY2NjIyMnww&ixlib=rb-4.1.0&q=80&w=1080',
  colors: 'https://images.unsplash.com/photo-1645738384923-2a57d86aa26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvciUyMHBhbGV0dGUlMjBwYWludHxlbnwxfHx8fDE3NjM2NjYyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  family: 'https://images.unsplash.com/photo-1628270251031-9262ac25387b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB0b2dldGhlciUyMG1pbmltYWx8ZW58MXx8fHwxNzYzNjY2MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  weather: 'https://images.unsplash.com/photo-1631728815316-323e4340748d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHN3ZWF0aGVyJTIwY2xvdWRzJTIwc2t5fGVufDF8fHx8MTc2MzY1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080',
  // Dynamic categories from Wiktextract
  body: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  animals: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  transportation: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  time: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  home: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  work: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  emotions: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  actions: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  adjectives: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  general: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
};

const categoryEmojis: Record<string, string> = {
  greetings: '👋',
  numbers: '🔢',
  food: '🍽️',
  colors: '🎨',
  family: '👨‍👩‍👧‍👦',
  weather: '⛅',
  body: '👤',
  animals: '🐕',
  clothing: '👕',
  transportation: '🚗',
  time: '⏰',
  home: '🏠',
  work: '💼',
  emotions: '😊',
  actions: '🏃',
  adjectives: '📝',
  general: '📚',
};

export function CategoryList({ categories, vocabularyWords, onSelectCategory, selectedDifficulty }: CategoryListProps) {
  const getWordCount = (categoryId: string) => {
    // Calculate actual count from vocabulary words that include this category
    let words = vocabularyWords.filter((word) => 
      word.categories && word.categories.includes(categoryId)
    );
    
    console.log(`🔍 Category ${categoryId} before difficulty filter:`, words.length, 'words');
    
    // Filter by difficulty level if not 'all'
    if (selectedDifficulty !== 'all') {
      const beforeFilter = words.length;
      words = words.filter(word => word.difficulty === selectedDifficulty);
      console.log(`🔍 Category ${categoryId} after ${selectedDifficulty} filter:`, words.length, 'words (was', beforeFilter, ')');
      
      // Debug: Show first few words and their difficulties
      if (beforeFilter > 0 && words.length === 0) {
        const sample = vocabularyWords.filter((word) => 
          word.categories && word.categories.includes(categoryId)
        ).slice(0, 3);
        console.log(`🔍 Sample words in ${categoryId}:`, sample.map(w => ({ 
          finnish: w.finnish, 
          difficulty: w.difficulty,
          hasProperty: 'difficulty' in w
        })));
      }
    }
    
    return words.length;
  };

  const getCategoryEmoji = (categoryId: string) => {
    return categoryEmojis[categoryId] || '📚';
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-95 group"
          >
            {/* Image */}
            <div className="relative h-2/3 overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={categoryImages[category.id] || categoryImages.general}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Emoji overlay */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1">
                <span className="text-lg">{getCategoryEmoji(category.id)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="h-1/3 p-4 flex flex-col justify-center">
              <h3 className="text-gray-900 font-bold">{category.name}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{getWordCount(category.id)} words</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}