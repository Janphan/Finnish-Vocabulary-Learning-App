import { Category, VocabularyWord } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryListProps {
  categories: Category[];
  vocabularyWords: VocabularyWord[];
  onSelectCategory: (categoryId: string) => void;
  selectedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

const categoryImages: Record<string, string> = {
  // Semantic categories with unique illustrations
  'Family & People': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&crop=face',
  'Time & Numbers': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop',
  'Basic Actions': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'Nature & Weather': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'Colors & Appearance': 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=400&h=300&fit=crop',
  'Body': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=face',
  'Food & Drink': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'Animals': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
  'Work & Education': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=300&fit=crop',
  'Transportation': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
  'Emotions & Mental States': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
  'Home & Living': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
  
  // Part of speech categories - unique abstract/concept images
  'noun': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
  'verb': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  'adjective': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'adverb': 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&h=300&fit=crop',
  'pronoun': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
  'proper_noun': 'https://images.unsplash.com/photo-1477414956199-7dafc86a4f1a?w=400&h=300&fit=crop',
  'preposition': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&h=300&fit=crop',
  'interjection': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop',
  
  // Legacy and fallback categories - all unique
  'greetings': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=face',
  'numbers': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
  'food': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
  'colors': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
  'family': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  'weather': 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop',
  'body': 'https://images.unsplash.com/photo-1594824804732-da3873615e61?w=400&h=300&fit=crop',
  'animals': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
  'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  'transportation': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
  'time': 'https://images.unsplash.com/photo-1499962703069-c654289b5ad7?w=400&h=300&fit=crop',
  'home': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  'work': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
  'emotions': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'actions': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop',
  'adjectives': 'https://images.unsplash.com/photo-1532153354603-2ba9420952f0?w=400&h=300&fit=crop',
  'general': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
};

export function CategoryList({ categories, vocabularyWords, onSelectCategory, selectedDifficulty }: CategoryListProps) {
  const getWordCount = (categoryId: string) => {
    // Calculate actual count from vocabulary words that include this category
    let words = vocabularyWords.filter((word) => 
      word.categories && word.categories.includes(categoryId)
    );
    
    // Filter by difficulty level if not 'all'
    if (selectedDifficulty !== 'all') {
      words = words.filter(word => word.difficulty === selectedDifficulty);
    }
    
    return words.length;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => {
          const wordCount = getWordCount(category.id);
          const imageUrl = categoryImages[category.id] || categoryImages.general;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 active:scale-95 hover:-translate-y-1"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {/* Image */}
              <div className="relative h-24 overflow-hidden">
                <ImageWithFallback
                  src={imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Word count badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                  {wordCount}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 text-left leading-tight group-hover:text-gray-700 transition-colors mb-2">
                  {category.name}
                </h3>
                
                {/* Progress indicator */}
                <div className="bg-gray-100 rounded-full h-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500 group-hover:from-gray-500 group-hover:to-gray-600"
                    style={{ 
                      width: wordCount > 0 ? `${Math.min((wordCount / Math.max(...categories.map(c => getWordCount(c.id)))) * 100, 100)}%` : '0%'
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Empty state */}
      {categories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading categories...</h3>
          <p className="text-sm text-gray-500">Getting your vocabulary ready</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        </div>
      )}
    </div>
  );
}