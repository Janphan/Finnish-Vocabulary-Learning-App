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
  currentUser: User | null;
}

type AdminTab = "vocabulary" | "categories" | "users";

export const AdminDashboard = ({
  words,
  categories,
  onBack,
  onWordUpdate,
  onWordDelete,
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
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("vocabulary")}
                className={`${
                  activeTab === "vocabulary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Vocabulary ({words.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
          {activeTab === "categories" && <CategoryManager categories={categories} />}
          {activeTab === "users" && <UserManager />}
        </div>
      </div>
    </div>
  );
};