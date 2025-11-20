import { Category, VocabularyWord } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryListProps {
  categories: Category[];
  vocabularyWords: VocabularyWord[];
  onSelectCategory: (categoryId: string) => void;
}

const categoryImages: Record<string, string> = {
  greetings: 'https://images.unsplash.com/photo-1737569943524-8edf753c4e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVldGluZyUyMGhhbmRzaGFrZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYzNjY2MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  numbers: 'https://images.unsplash.com/photo-1666071083297-601c9b0701a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1iZXJzJTIwbWF0aGVtYXRpY3MlMjBtaW5pbWFsfGVufDF8fHx8MTc2MzY2NjIyMXww&ixlib=rb-4.1.0&q=80&w=1080',
  food: 'https://images.unsplash.com/photo-1547825407-6d03f5aa43dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwTm9yZGljJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MzY2NjIyMnww&ixlib=rb-4.1.0&q=80&w=1080',
  colors: 'https://images.unsplash.com/photo-1645738384923-2a57d86aa26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvciUyMHBhbGV0dGUlMjBwYWludHxlbnwxfHx8fDE3NjM2NjYyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  family: 'https://images.unsplash.com/photo-1628270251031-9262ac25387b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB0b2dldGhlciUyMG1pbmltYWx8ZW58MXx8fHwxNzYzNjY2MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  weather: 'https://images.unsplash.com/photo-1631728815316-323e4340748d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwY2xvdWRzJTIwc2t5fGVufDF8fHx8MTc2MzY1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080',
};

export function CategoryList({ categories, vocabularyWords, onSelectCategory }: CategoryListProps) {
  const getWordCount = (categoryId: string) => {
    return vocabularyWords.filter((word) => word.categoryId === categoryId).length;
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
                src={categoryImages[category.id]}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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