import { CategoryList } from "./CategoryList";
import { Coffee, Globe, Folder, Brain, LogOut } from "lucide-react";
import { translations, Language } from "../utils/translations";

interface Props {
  categories: any[];
  vocabularyWords: any[];
  selectedDifficulty: "beginner" | "intermediate" | "advanced" | "all";
  language: Language;
  categoryTranslations: any;
  onSelectCategory: (id: string) => void;
  onToggleLanguage: () => void;
  onOpenFolders: () => void;
  onOpenLearning: () => void;
  onDonate: () => void;
  dueWordsCount: number;
  currentUser: any;
  onSignIn: () => void;
  onSignOut: () => void;
  onSelectDifficulty: (
    difficulty: "beginner" | "intermediate" | "advanced" | "all"
  ) => void;
  onManageDatabase: () => void;
  isAdmin: boolean;
}

export function CategoriesView({
  categories,
  vocabularyWords,
  selectedDifficulty,
  language,
  categoryTranslations,
  onSelectCategory,
  onToggleLanguage,
  onOpenFolders,
  onOpenLearning,
  onDonate,
  dueWordsCount,
  currentUser,
  onSignIn,
  onSignOut,
  onSelectDifficulty,
  onManageDatabase,
  isAdmin,
}: Props) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
              <p className="text-xs text-gray-600">
                {vocabularyWords.length} {t.words}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDonate}
                className="p-2.5 hover:bg-yellow-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-yellow-200 hover:border-yellow-300"
                title="Donate - Buy Me a Coffee"
              >
                <Coffee className="w-4 h-4 text-yellow-700 hover:text-yellow-900 transition-colors" />
              </button>
              <button
                onClick={onToggleLanguage}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                title={language === "en" ? "Suomeksi" : "In English"}
              >
                <Globe className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
              </button>
              {currentUser && (
                <button
                  onClick={onOpenFolders}
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                  title="My Folders"
                >
                  <Folder className="w-4 h-4 text-gray-600 hover:text-gray-700 transition-colors" />
                </button>
              )}
              <button
                onClick={onOpenLearning}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
                title="Learning Activities"
              >
                <Brain className="w-4 h-4 text-gray-600" />
                {dueWordsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {dueWordsCount}
                  </span>
                )}
              </button>
              {!currentUser ? (
                <button
                  onClick={onSignIn}
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
                    onClick={onSignOut}
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
                  onSelectDifficulty(
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
                <option value="intermediate">⭐ {t.intermediateLevel}</option>
                <option value="advanced">🚀 {t.advancedLevel}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <CategoryList
        categories={categories}
        vocabularyWords={vocabularyWords}
        onSelectCategory={onSelectCategory}
        selectedDifficulty={selectedDifficulty}
        language={language}
        categoryTranslations={categoryTranslations}
      />
      {isAdmin && (
        <div className="mt-8 pt-8 border-t border-red-200 px-8 pb-8 bg-red-50/30">
          <p className="text-red-600 mb-3 text-sm font-medium">
            🔧 Admin Tools
          </p>
          <button
            onClick={onManageDatabase}
            className="px-6 py-3 bg-red-600 text-black rounded-xl font-medium shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Manage Database
          </button>
        </div>
      )}
    </div>
  );
}
