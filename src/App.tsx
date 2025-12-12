import { useState, useEffect } from "react";
import { CategoryList } from "./components/CategoryList";
import { VocabularySwiper } from "./components/VocabularySwiper";
import { FolderManager } from "./components/FolderManager";
import { Folder, ArrowLeft, Globe, Brain, Coffee, LogOut } from "lucide-react";
import { useFirestoreVocabulary } from "./hooks/useFirestoreVocabulary";
import { PracticeQuiz } from "./PracticeGame/PracticeQuiz";
import { useAuth } from "./contexts/AuthContext";
import { authService } from "./services/firebaseAuth";
import { FirebaseVocabularyService } from "./services/firebaseVocabulary";
import { calculateReview } from "./utils/srsLogic";
import { ReviewSession } from "./components/ReviewSession";
import { AlarmClock } from "lucide-react";

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
  interval?: number; // Current interval in days (optional for existing data)
  repetitions?: number; // Streak of correct answers (optional for existing data)
  easinessFactor?: number; // The multiplier (starts at 2.5) (optional for existing data)
  nextReviewDate?: string; // ISO date string (e.g., "2025-12-25") (optional for existing data)
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

type View =
  | "categories"
  | "vocabulary"
  | "folders"
  | "loading"
  | "practice"
  | "review";

const MAX_REVIEW_WORDS = 20;

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
  const [reviewedWordIds, setReviewedWordIds] = useState<Set<string>>(
    new Set()
  );

  const t = translations[language];

  const {
    words: allWords,
    categories,
    loading: vocabLoading,
    refresh,
  } = useFirestoreVocabulary({});

  const getDueWords = () => {
    const now = new Date();
    return allWords.filter((word) => {
      // If it has no date, it's new -> It's Due
      if (!word.nextReviewDate) return true;
      // If date is in the past -> It's Due
      return new Date(word.nextReviewDate) <= now;
    });
  };

  const dueWords = getDueWords()
    .filter((word) => !reviewedWordIds.has(word.id))
    .sort((a, b) => {
      // Sort: beginner < intermediate < advanced
      const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return (
        diffOrder[a.difficulty || "beginner"] -
        diffOrder[b.difficulty || "beginner"]
      );
    })
    .slice(0, MAX_REVIEW_WORDS);

  const getSessionWords = () => {
    const history = JSON.parse(localStorage.getItem("reviewHistory") || "{}");

    // Prioritize hard words (grade <= 2)
    const hardWords = allWords.filter((word) => history[word.id]?.grade <= 2);

    // Add new words not yet reviewed
    const newWords = allWords.filter((word) => !history[word.id]);

    // Fill up to MAX_REVIEW_WORDS
    const sessionWords = [...hardWords, ...newWords].slice(0, MAX_REVIEW_WORDS);

    return sessionWords;
  };

  const sessionWords = getSessionWords();

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

  // Save review results in localStorage or Firestore
  const handleSmartReview = async (word: VocabularyWord, grade: number) => {
    if (!currentUser) return;
    const updates = calculateReview(word, grade);
    await FirebaseVocabularyService.updateWord(
      currentUser.uid,
      word.id,
      updates
    );

    // Save review history locally
    const history = JSON.parse(localStorage.getItem("reviewHistory") || "{}");
    history[word.id] = { grade, reviewedAt: new Date().toISOString() };
    localStorage.setItem("reviewHistory", JSON.stringify(history));

    setReviewedWordIds((prev) => new Set(prev).add(word.id));
  };

  const resetReviewSession = async () => {
    await refresh(); // Fetch updated words from Firestore
    setReviewedWordIds(new Set());
    setCurrentView("review");
  };

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
                  {/* Add the Review Due button here */}
                  {currentUser && (
                    <button
                      onClick={resetReviewSession}
                      className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
                      title="Review Due Words"
                    >
                      <AlarmClock className="w-4 h-4 text-gray-600" />
                      {dueWords.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {dueWords.length}
                        </span>
                      )}
                    </button>
                  )}
                  {!currentUser ? (
                    <button
                      onClick={() => authService.signInWithGoogle()}
                      className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                      title={t.signIn}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
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

      {currentView === "review" && (
        <ReviewSession
          words={sessionWords}
          onGrade={handleSmartReview}
          onBack={() => setCurrentView("categories")}
        />
      )}
    </div>
  );
}
