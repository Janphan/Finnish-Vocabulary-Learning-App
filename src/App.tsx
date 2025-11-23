import { useState, useEffect } from "react";
import { CategoryList } from "./components/CategoryList";
import { VocabularySwiper } from "./components/VocabularySwiper";
import { FolderManager } from "./components/FolderManager";
import {
  Folder,
  ArrowLeft,
  Globe,
  Brain,
  Coffee,
  LogOut,
  LogIn,
} from "lucide-react";
import { useFirestoreVocabulary } from "./hooks/useFirestoreVocabulary";
import { PracticeQuiz } from "./PracticeGame/PracticeQuiz";
import { useAuth } from "./contexts/AuthContext";
import { authService } from "./services/firebaseAuth";
import { FirebaseVocabularyService } from "./services/firebaseVocabulary";

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
    connectionError: "Connection error",
    signIn: "Sign in with Google",
    signOut: "Sign Out",
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
    connectionError: "Yhteysvirhe",
    signIn: "Kirjaudu sisään Googlella",
    signOut: "Kirjaudu ulos",
  },
};

// Category name translations
const categoryTranslations = {
  en: {
    "Family & People": "Family & People",
    "Time & Numbers": "Time & Numbers",
    "Basic Actions": "Basic Actions",
    "Nature & Weather": "Nature & Weather",
    "Colors & Appearance": "Colors & Appearance",
    Body: "Body",
    "Food & Drink": "Food & Drink",
    Animals: "Animals",
    "Work & Education": "Work & Education",
    Transportation: "Transportation",
    "Emotions & Mental States": "Emotions & Mental States",
    "Home & Living": "Home & Living",
    noun: "Noun",
    verb: "Verb",
    adjective: "Adjective",
    adverb: "Adverb",
    pronoun: "Pronoun",
    proper_noun: "Proper Noun",
    preposition: "Preposition",
    interjection: "Interjection",
    Noun: "Noun",
    Verb: "Verb",
    Adjective: "Adjective",
    Adverb: "Adverb",
    Pronoun: "Pronoun",
    Proper_noun: "Proper Noun",
    Preposition: "Preposition",
    Interjection: "Interjection",
    greetings: "Greetings",
    numbers: "Numbers",
    food: "Food",
    colors: "Colors",
    family: "Family",
    weather: "Weather",
    body: "Body",
    animals: "Animals",
    clothing: "Clothing",
    transportation: "Transportation",
    time: "Time",
    home: "Home",
    work: "Work",
    emotions: "Emotions",
    actions: "Actions",
    adjectives: "Adjectives",
    general: "General",
  },
  fi: {
    "Family & People": "Perhe & Ihmiset",
    "Time & Numbers": "Aika & Numerot",
    "Basic Actions": "Perustoiminnot",
    "Nature & Weather": "Luonto & Sää",
    "Colors & Appearance": "Värit & Ulkonäkö",
    Body: "Keho",
    "Food & Drink": "Ruoka & Juoma",
    Animals: "Eläimet",
    "Work & Education": "Työ & Koulutus",
    Transportation: "Liikenne",
    "Emotions & Mental States": "Tunteet & Mielentilat",
    "Home & Living": "Koti & Asuminen",
    noun: "Substantiivi",
    verb: "Verbi",
    adjective: "Adjektiivi",
    adverb: "Adverbi",
    pronoun: "Pronomini",
    proper_noun: "Erisnimi",
    preposition: "Prepositio",
    interjection: "Huudahdus",
    Noun: "Substantiivi",
    Verb: "Verbi",
    Adjective: "Adjektiivi",
    Adverb: "Adverbi",
    Pronoun: "Pronomini",
    Proper_noun: "Erisnimi",
    Preposition: "Prepositio",
    Interjection: "Huudahdus",
    greetings: "Tervehdykset",
    numbers: "Numerot",
    food: "Ruoka",
    colors: "Värit",
    family: "Perhe",
    weather: "Sää",
    body: "Keho",
    animals: "Eläimet",
    clothing: "Vaatteet",
    transportation: "Liikenne",
    time: "Aika",
    home: "Koti",
    work: "Työ",
    emotions: "Tunteet",
    actions: "Toiminnot",
    adjectives: "Adjektiivit",
    general: "Yleinen",
  },
};

type Language = "en" | "fi";

export interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  partOfSpeech?: string;
  categories: string[];
  cefr?: string;
  pronunciation?: string;
  audio?: string | null;
  examples?: string[];
  difficultyScore?: number;
  frequency?: number;
  example?: string;
  aiGenerated?: boolean;
  generatedAt?: string;
  aiService?: string | null;
  categoryId?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  fallbackUsed?: boolean;
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

type View = "categories" | "vocabulary" | "folders" | "loading" | "practice";

export default function App() {
  const { currentUser, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>("loading");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | "all"
  >("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [language, setLanguage] = useState<Language>("en");

  const t = translations[language];

  const {
    words: allWords,
    categories,
    loading: vocabLoading,
    error,
  } = useFirestoreVocabulary({});

  useEffect(() => {
    if (!authLoading && !vocabLoading && currentView === "loading") {
      setCurrentView("categories");
    }
  }, [authLoading, vocabLoading, currentView]);

  useEffect(() => {
    if (currentUser) {
      FirebaseVocabularyService.getUserData(currentUser.uid).then(
        ({ folders, favorites }) => {
          setFolders(folders);
          setFavorites(new Set(favorites));
        }
      );
    } else {
      setFolders([]);
      setFavorites(new Set());
    }
  }, [currentUser]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView("vocabulary");
  };

  const handleBack = () => {
    setCurrentView("categories");
    setSelectedCategoryId(null);
  };

  const handleToggleFavorite = async (wordId: string) => {
    if (!currentUser) return;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(wordId)) {
      newFavorites.delete(wordId);
    } else {
      newFavorites.add(wordId);
    }
    setFavorites(newFavorites);
    await FirebaseVocabularyService.updateUserFavorites(
      currentUser.uid,
      Array.from(newFavorites)
    );
  };

  const handleCreateFolder = async (name: string) => {
    if (!currentUser) return;
    const newFolder: UserFolder = {
      id: Date.now().toString(),
      name,
      wordIds: [],
    };
    const newFolders = [...folders, newFolder];
    setFolders(newFolders);
    await FirebaseVocabularyService.updateUserFolders(
      currentUser.uid,
      newFolders
    );
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!currentUser) return;
    const newFolders = folders.filter((f) => f.id !== folderId);
    setFolders(newFolders);
    await FirebaseVocabularyService.updateUserFolders(
      currentUser.uid,
      newFolders
    );
  };

  const handleAddToFolder = async (wordId: string, folderId: string) => {
    if (!currentUser) return;
    const newFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        const newWordIds = folder.wordIds.includes(wordId)
          ? folder.wordIds.filter((id) => id !== wordId)
          : [...folder.wordIds, wordId];
        return { ...folder, wordIds: newWordIds };
      }
      return folder;
    });
    setFolders(newFolders);
    await FirebaseVocabularyService.updateUserFolders(
      currentUser.uid,
      newFolders
    );
  };

  const getCategoryWords = (categoryId: string) => {
    let categoryWords = allWords.filter((word: VocabularyWord) => {
      const hasCategories = word.categories && Array.isArray(word.categories);
      const includesCategory = hasCategories
        ? word.categories.includes(categoryId)
        : false;
      const matchesCategoryId = word.categoryId === categoryId;

      return includesCategory || matchesCategoryId;
    });

    if (selectedDifficulty !== "all") {
      categoryWords = categoryWords.filter(
        (word: VocabularyWord) => word.difficulty === selectedDifficulty
      );
    }

    return categoryWords;
  };

  const selectedCategory = categories.find(
    (c: Category) => c.id === selectedCategoryId
  );

  if (authLoading || (vocabLoading && currentView === "loading")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full animate-bounce"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t.loading}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {vocabLoading ? t.gettingVocabulary : t.almostReady}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "categories" && (
        <>
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-md mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {t.title}
                  </h1>
                  <p className="text-xs text-gray-600">
                    {allWords.length} {t.words}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      window.open(
                        "https://buymeacoffee.com/hong_phan",
                        "_blank"
                      )
                    }
                    className="p-2.5 hover:bg-yellow-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-yellow-200 hover:border-yellow-300"
                    title="Donate - Buy Me a Coffee"
                  >
                    <Coffee className="w-4 h-4 text-yellow-700 hover:text-yellow-900 transition-colors" />
                  </button>
                  <button
                    onClick={() => setLanguage(language === "en" ? "fi" : "en")}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                    title={language === "en" ? "Suomeksi" : "In English"}
                  >
                    <Globe className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => setCurrentView("folders")}
                      className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                      title="My Folders"
                    >
                      <Folder className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentView("practice")}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                    title="Practice Quiz"
                  >
                    <Brain className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                  </button>
                  {!currentUser ? (
                    <button
                      onClick={() => authService.signInWithGoogle()}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 border-2 border-blue-500 hover:border-blue-600"
                      title={t.signIn}
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="text-xs font-semibold">{t.signIn}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.photoURL || undefined}
                        alt="User"
                        className="w-4 h-4 rounded-full text-gray-600 hover:text-gray-700 transition-colors"
                      />
                      <button
                        onClick={() => authService.signOut()}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                        title={t.signOut}
                      >
                        <LogOut className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  {t.chooseLevel}
                </p>
                <div className="relative">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) =>
                      setSelectedDifficulty(
                        e.target.value as
                          | "beginner"
                          | "intermediate"
                          | "advanced"
                          | "all"
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-white text-gray-800 border-2 border-gray-300 focus:border-green-500 focus:bg-green-50 focus:text-green-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      backgroundImage: "none",
                    }}
                  >
                    <option value="all">🌟 {t.allLevels}</option>
                    <option value="beginner">🌱 {t.basicLevel}</option>
                    <option value="intermediate">
                      ⭐ {t.intermediateLevel}
                    </option>
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

      {currentView === "vocabulary" && selectedCategory && (
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

      {currentView === "folders" && (
        <>
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
                  <p className="text-gray-500 text-sm">
                    {t.organizeVocabulary}
                  </p>
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

      {currentView === "practice" && (
        <div className="min-h-screen bg-white">
          <div className="p-4">
            <button
              onClick={() => setCurrentView("categories")}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
            >
              ← Back
            </button>
          </div>
          <PracticeQuiz
            words={
              allWords.length >= 20
                ? [...allWords].sort(() => Math.random() - 0.5).slice(0, 20)
                : allWords
            }
          />
        </div>
      )}
    </div>
  );
}
