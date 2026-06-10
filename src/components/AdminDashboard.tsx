import { useState } from "react";
import { VocabularyManager } from "./VocabularyManager";
import { CategoryManager } from "./CategoryManager";
import { UserManager } from "./UserManager";
import { VocabularyWord, Category } from "../types";
import { User } from "firebase/auth";

interface Props {
  words: VocabularyWord[];
  categories: Category[];
  onBack: () => void;
  onWordUpdate: (word: VocabularyWord) => void;
  onWordDelete: (id: string) => void;
  onCategoryUpdate: (category: Category) => void;
  currentUser: User | null;
}

type AdminTab = "vocabulary" | "categories" | "users";

export const AdminDashboard = ({
  words,
  categories,
  onBack,
  onWordUpdate,
  onWordDelete,
  onCategoryUpdate,
  currentUser,
}: Props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("vocabulary");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Exit Admin
            </button>
          </div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("vocabulary")}
                className={`${
                  activeTab === "vocabulary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-md transition-colors`}
              >
                Vocabulary ({words.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-md transition-colors`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-md transition-colors`}
              >
                Users
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {activeTab === "vocabulary" && (
            <VocabularyManager
              words={words}
              onWordUpdate={onWordUpdate}
              onWordDelete={onWordDelete}
              onBack={onBack}
              currentUser={currentUser}
            />
          )}
          {activeTab === "categories" && (
            <CategoryManager categories={categories} onCategoryUpdate={onCategoryUpdate} />
          )}
          {activeTab === "users" && <UserManager />}
        </div>
      </div>
    </div>
  );
};