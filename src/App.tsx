import { useState, useEffect } from "react";
import { CategoriesView } from "./components/CategoriesView";
import { FoldersView } from "./components/FoldersView";
import { PracticeView } from "./components/PracticeView";
import { ReviewView } from "./components/ReviewView";
import { LearningView } from "./components/LearningView";
import { useFirestoreVocabulary } from "./hooks/useFirestoreVocabulary";
import { authService } from "./services/firebaseAuth";
import { FirebaseVocabularyService } from "./services/firebaseVocabulary";
import { calculateReview } from "./utils/srsLogic";
import { VocabularySwiper } from "./components/VocabularySwiper";
import { useAuth } from "./contexts/AuthContext";
import {
  translations,
  categoryTranslations,
  Language,
} from "./utils/translations"; // Add this import
import { VocabularyWord, Category, UserFolder } from "./types"; // Add this import
import { VocabularyManager } from "./components/VocabularyManager";

const MAX_REVIEW_WORDS = 20;

export default function App() {
  const { currentUser, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<
    | "categories"
    | "vocabulary"
    | "folders"
    | "practice"
    | "review"
    | "learning"
    | "loading"
  >("categories");
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
  const [sessionWords, setSessionWords] = useState<VocabularyWord[]>([]); // Add this state
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]); // Your full word list
  const [mode, setMode] = useState<"home" | "review" | "manager">("home");

  const t = translations[language];

  const {
    words: fetchedWords,
    categories,
    loading: vocabLoading,
    refresh,
  } = useFirestoreVocabulary({});

  useEffect(() => {
    setAllWords(fetchedWords);
  }, [fetchedWords]);

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

  const getSessionWords = (updatedSessionWords?: VocabularyWord[]) => {
    const wordsToUse = updatedSessionWords || allWords;
    const history = JSON.parse(localStorage.getItem("reviewHistory") || "{}");

    // Prioritize hard words (grade <= 2)
    const hardWords = wordsToUse.filter((word) => history[word.id]?.grade <= 2);

    // Add new words not yet reviewed
    const newWords = wordsToUse.filter((word) => !history[word.id]);

    // Fill up to MAX_REVIEW_WORDS
    const sessionWords = [...hardWords, ...newWords].slice(0, MAX_REVIEW_WORDS);

    return sessionWords;
  };

  useEffect(() => {
    const words = getSessionWords();
    setSessionWords(words);
  }, [allWords, reviewedWordIds]); // Update when dependencies change

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

  // Handle word updates from review session
  const handleWordUpdate = (updatedWord: VocabularyWord) => {
    setAllWords((prevWords) =>
      prevWords.map((w) => (w.id === updatedWord.id ? updatedWord : w))
    );

    // Update session words if in review mode
    if (currentView === "review") {
      setSessionWords((prevWords) =>
        prevWords.map((w) => (w.id === updatedWord.id ? updatedWord : w))
      );
    }
  };

  const resetReviewSession = async () => {
    await refresh(); // Fetch updated words from Firestore
    setReviewedWordIds(new Set());
    setCurrentView("review");
  };

  // Handle deletions locally
  const handleWordDelete = (id: string) => {
    setAllWords((prev) => prev.filter((w) => w.id !== id));
  };

  const isAdmin =
    currentUser && currentUser.uid === import.meta.env.VITE_ADMIN_UID;

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
      {mode === "home" && currentView === "categories" && (
        <CategoriesView
          categories={categories}
          vocabularyWords={allWords}
          selectedDifficulty={selectedDifficulty}
          language={language}
          categoryTranslations={categoryTranslations}
          onSelectCategory={handleCategorySelect}
          onToggleLanguage={() => setLanguage(language === "en" ? "fi" : "en")}
          onOpenFolders={() => setCurrentView("folders")}
          onOpenLearning={() => setCurrentView("learning")}
          onDonate={() =>
            window.open("https://buymeacoffee.com/hong_phan", "_blank")
          }
          dueWordsCount={dueWords.length}
          currentUser={currentUser}
          onSignIn={() => authService.signInWithGoogle()}
          onSignOut={() => authService.signOut()}
          onSelectDifficulty={setSelectedDifficulty} // Fix: Pass the setter function
          onManageDatabase={() => setMode("manager")} // Add this
          isAdmin={isAdmin || false}
        />
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
          onWordUpdate={handleWordUpdate}
        />
      )}

      {currentView === "folders" && (
        <FoldersView
          folders={folders}
          favorites={favorites}
          vocabularyWords={allWords}
          language={language}
          onBack={handleBack}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      {currentView === "practice" && (
        <PracticeView
          quizWords={[]} // Placeholder for now, will be populated by quick quiz logic
          allWords={allWords}
          onBack={() => setCurrentView("categories")}
        />
      )}

      {currentView === "review" && (
        <ReviewView
          sessionWords={sessionWords}
          onGrade={handleSmartReview}
          onBack={() => setCurrentView("categories")}
          onWordUpdate={handleWordUpdate}
        />
      )}

      {currentView === "learning" && (
        <LearningView
          onBack={() => setCurrentView("categories")}
          onReviewSession={resetReviewSession}
          onQuickQuiz={() => setCurrentView("practice")}
          dueWordsCount={dueWords.length}
        />
      )}

      {/* MANAGER SCREEN */}
      {mode === "manager" && (
        <VocabularyManager
          words={allWords}
          onBack={() => setMode("home")}
          onWordUpdate={handleWordUpdate} // The same update function we wrote before
          onWordDelete={handleWordDelete}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
