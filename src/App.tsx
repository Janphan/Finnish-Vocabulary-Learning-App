import { useState } from 'react';
import { CategoryList } from './components/CategoryList';
import { VocabularySwiper } from './components/VocabularySwiper';
import { FolderManager } from './components/FolderManager';
import { Menu, Folder, ArrowLeft } from 'lucide-react';

export interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  categoryId: string;
  pronunciation: string;
  example: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface UserFolder {
  id: string;
  name: string;
  wordIds: string[];
}

const categories: Category[] = [
  { id: 'greetings', name: 'Greetings', emoji: '👋' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢' },
  { id: 'food', name: 'Food', emoji: '🍽️' },
  { id: 'colors', name: 'Colors', emoji: '🎨' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'weather', name: 'Weather', emoji: '⛅' },
];

const vocabularyWords: VocabularyWord[] = [
  // Greetings
  { id: '1', finnish: 'Hei', english: 'Hello', categoryId: 'greetings', pronunciation: 'hey', example: 'Hei, kuinka voit? (Hello, how are you?)' },
  { id: '2', finnish: 'Moi', english: 'Hi', categoryId: 'greetings', pronunciation: 'moy', example: 'Moi! Hauska tavata. (Hi! Nice to meet you.)' },
  { id: '3', finnish: 'Terve', english: 'Hey', categoryId: 'greetings', pronunciation: 'ter-veh', example: 'Terve! Mitä kuuluu? (Hey! What\'s up?)' },
  { id: '4', finnish: 'Kiitos', english: 'Thank you', categoryId: 'greetings', pronunciation: 'kee-tos', example: 'Kiitos avusta! (Thank you for the help!)' },
  { id: '5', finnish: 'Ole hyvä', english: 'You\'re welcome', categoryId: 'greetings', pronunciation: 'o-leh hü-vä', example: 'Ole hyvä, ei kestä. (You\'re welcome, no problem.)' },
  { id: '6', finnish: 'Anteeksi', english: 'Sorry', categoryId: 'greetings', pronunciation: 'an-tek-si', example: 'Anteeksi, olin myöhässä. (Sorry, I was late.)' },
  { id: '7', finnish: 'Näkemiin', english: 'Goodbye', categoryId: 'greetings', pronunciation: 'nä-ke-meen', example: 'Näkemiin! Hyvää päivää! (Goodbye! Have a good day!)' },
  { id: '8', finnish: 'Hyvää päivää', english: 'Good day', categoryId: 'greetings', pronunciation: 'hü-vää päi-vää', example: 'Hyvää päivää! Voinko auttaa? (Good day! Can I help?)' },
  // Numbers
  { id: '9', finnish: 'Yksi', english: 'One', categoryId: 'numbers', pronunciation: 'ük-si', example: 'Minulla on yksi koira. (I have one dog.)' },
  { id: '10', finnish: 'Kaksi', english: 'Two', categoryId: 'numbers', pronunciation: 'kak-si', example: 'Kaksi kahvia, kiitos. (Two coffees, please.)' },
  { id: '11', finnish: 'Kolme', english: 'Three', categoryId: 'numbers', pronunciation: 'kol-meh', example: 'Kolme lasta leikkii. (Three children are playing.)' },
  { id: '12', finnish: 'Neljä', english: 'Four', categoryId: 'numbers', pronunciation: 'nel-yä', example: 'Neljä vuodenaikaa. (Four seasons.)' },
  { id: '13', finnish: 'Viisi', english: 'Five', categoryId: 'numbers', pronunciation: 'vee-si', example: 'Kello on viisi. (It\'s five o\'clock.)' },
  { id: '14', finnish: 'Kuusi', english: 'Six', categoryId: 'numbers', pronunciation: 'koo-si', example: 'Kuusi tuntia myöhässä. (Six hours late.)' },
  { id: '15', finnish: 'Seitsemän', english: 'Seven', categoryId: 'numbers', pronunciation: 'seyt-se-män', example: 'Seitsemän päivää viikossa. (Seven days a week.)' },
  { id: '16', finnish: 'Kahdeksan', english: 'Eight', categoryId: 'numbers', pronunciation: 'kah-dek-san', example: 'Kahdeksan omenaa. (Eight apples.)' },
  // Food
  { id: '17', finnish: 'Leipä', english: 'Bread', categoryId: 'food', pronunciation: 'ley-pä', example: 'Syön leipää aamiaiseksi. (I eat bread for breakfast.)' },
  { id: '18', finnish: 'Maito', english: 'Milk', categoryId: 'food', pronunciation: 'my-to', example: 'Haluan maitoa kahviin. (I want milk in my coffee.)' },
  { id: '19', finnish: 'Kahvi', english: 'Coffee', categoryId: 'food', pronunciation: 'kah-vi', example: 'Juon kahvia aamulla. (I drink coffee in the morning.)' },
  { id: '20', finnish: 'Vesi', english: 'Water', categoryId: 'food', pronunciation: 'veh-si', example: 'Vesi on terveellistä. (Water is healthy.)' },
  { id: '21', finnish: 'Kala', english: 'Fish', categoryId: 'food', pronunciation: 'ka-la', example: 'Pidän kalasta. (I like fish.)' },
  { id: '22', finnish: 'Liha', english: 'Meat', categoryId: 'food', pronunciation: 'lee-ha', example: 'Liha on herkullista. (Meat is delicious.)' },
  { id: '23', finnish: 'Juusto', english: 'Cheese', categoryId: 'food', pronunciation: 'yoo-sto', example: 'Juusto on hyvää leivän päällä. (Cheese is good on bread.)' },
  { id: '24', finnish: 'Omena', english: 'Apple', categoryId: 'food', pronunciation: 'o-me-na', example: 'Omena päivässä. (An apple a day.)' },
  // Colors
  { id: '25', finnish: 'Punainen', english: 'Red', categoryId: 'colors', pronunciation: 'poo-nai-nen', example: 'Ruusu on punainen. (The rose is red.)' },
  { id: '26', finnish: 'Sininen', english: 'Blue', categoryId: 'colors', pronunciation: 'si-ni-nen', example: 'Taivas on sininen. (The sky is blue.)' },
  { id: '27', finnish: 'Keltainen', english: 'Yellow', categoryId: 'colors', pronunciation: 'kel-tai-nen', example: 'Aurinko on keltainen. (The sun is yellow.)' },
  { id: '28', finnish: 'Vihreä', english: 'Green', categoryId: 'colors', pronunciation: 'vih-re-ä', example: 'Ruoho on vihreää. (The grass is green.)' },
  { id: '29', finnish: 'Valkoinen', english: 'White', categoryId: 'colors', pronunciation: 'val-koi-nen', example: 'Lumi on valkoista. (Snow is white.)' },
  { id: '30', finnish: 'Musta', english: 'Black', categoryId: 'colors', pronunciation: 'mus-ta', example: 'Yö on musta. (Night is black.)' },
  { id: '31', finnish: 'Harmaa', english: 'Gray', categoryId: 'colors', pronunciation: 'har-maa', example: 'Pilvet ovat harmaita. (The clouds are gray.)' },
  { id: '32', finnish: 'Oranssi', english: 'Orange', categoryId: 'colors', pronunciation: 'o-rans-si', example: 'Appelsiini on oranssi. (Orange is orange.)' },
  // Family
  { id: '33', finnish: 'Äiti', english: 'Mother', categoryId: 'family', pronunciation: 'äi-ti', example: 'Äiti tekee ruokaa. (Mother is making food.)' },
  { id: '34', finnish: 'Isä', english: 'Father', categoryId: 'family', pronunciation: 'i-sä', example: 'Isä on töissä. (Father is at work.)' },
  { id: '35', finnish: 'Veli', english: 'Brother', categoryId: 'family', pronunciation: 'veh-li', example: 'Minulla on kaksi veljeä. (I have two brothers.)' },
  { id: '36', finnish: 'Sisko', english: 'Sister', categoryId: 'family', pronunciation: 'sis-ko', example: 'Sisko asuu Helsingissä. (Sister lives in Helsinki.)' },
  { id: '37', finnish: 'Lapsi', english: 'Child', categoryId: 'family', pronunciation: 'lap-si', example: 'Lapsi leikkii puistossa. (The child plays in the park.)' },
  { id: '38', finnish: 'Isoäiti', english: 'Grandmother', categoryId: 'family', pronunciation: 'i-so-äi-ti', example: 'Isoäiti leipoo pullaa. (Grandmother bakes buns.)' },
  { id: '39', finnish: 'Isoisä', english: 'Grandfather', categoryId: 'family', pronunciation: 'i-so-i-sä', example: 'Isoisä lukee sanomalehteä. (Grandfather reads the newspaper.)' },
  { id: '40', finnish: 'Perhe', english: 'Family', categoryId: 'family', pronunciation: 'per-he', example: 'Perhe on tärkeä. (Family is important.)' },
  // Weather
  { id: '41', finnish: 'Aurinko', english: 'Sun', categoryId: 'weather', pronunciation: 'au-rin-ko', example: 'Aurinko paistaa kirkkaasti. (The sun shines brightly.)' },
  { id: '42', finnish: 'Sade', english: 'Rain', categoryId: 'weather', pronunciation: 'sa-de', example: 'Ulkona sataa vettä. (It\'s raining outside.)' },
  { id: '43', finnish: 'Lumi', english: 'Snow', categoryId: 'weather', pronunciation: 'loo-mi', example: 'Lumi on kaunista. (Snow is beautiful.)' },
  { id: '44', finnish: 'Tuuli', english: 'Wind', categoryId: 'weather', pronunciation: 'too-li', example: 'Tuuli puhaltaa voimakkaasti. (The wind blows strongly.)' },
  { id: '45', finnish: 'Pilvi', english: 'Cloud', categoryId: 'weather', pronunciation: 'pil-vi', example: 'Taivaalla on pilviä. (There are clouds in the sky.)' },
  { id: '46', finnish: 'Kylmä', english: 'Cold', categoryId: 'weather', pronunciation: 'kül-mä', example: 'Talvi on kylmä. (Winter is cold.)' },
  { id: '47', finnish: 'Lämmin', english: 'Warm', categoryId: 'weather', pronunciation: 'läm-min', example: 'Kesä on lämmin. (Summer is warm.)' },
  { id: '48', finnish: 'Sää', english: 'Weather', categoryId: 'weather', pronunciation: 'sää', example: 'Sää on kaunis tänään. (The weather is beautiful today.)' },
];

type View = 'categories' | 'vocabulary' | 'folders';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<UserFolder[]>([]);

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
    return vocabularyWords.filter((word) => word.categoryId === categoryId);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

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
                  <p className="text-gray-500 text-sm">Choose a category</p>
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
            vocabularyWords={vocabularyWords}
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
            vocabularyWords={vocabularyWords}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </>
      )}
    </div>
  );
}