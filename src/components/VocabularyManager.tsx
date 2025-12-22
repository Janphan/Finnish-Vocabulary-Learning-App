import { useState, useMemo } from "react";
import { EditWordModal } from "./EditWordModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Search, Edit2, Trash2 } from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { VocabularyWord } from "../types";

interface Props {
  words: VocabularyWord[];
  onWordUpdate: (updatedWord: VocabularyWord) => void;
  onWordDelete: (deletedId: string) => void;
  onBack: () => void;
  currentUser: any;
}

export const VocabularyManager = ({
  words,
  onWordUpdate,
  onWordDelete,
  onBack,
  currentUser,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [deletingWord, setDeletingWord] = useState<VocabularyWord | null>(null);

  // Filter the list based on search (Finnish or English)
  const filteredWords = useMemo(() => {
    if (!searchTerm) return words;
    const lower = searchTerm.toLowerCase();
    return words.filter(
      (w) =>
        w.finnish.toLowerCase().includes(lower) ||
        w.english.toLowerCase().includes(lower)
    );
  }, [words, searchTerm]);

  const handleDeleteClick = (word: VocabularyWord) => {
    setDeletingWord(word);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWord) return;
    if (!currentUser) {
      alert("You must be logged in to delete words.");
      return;
    }
    try {
      await deleteDoc(doc(db, "vocabulary", deletingWord.id));
      onWordDelete(deletingWord.id);
    } catch (error) {
      console.error("Error deleting:", error);
      alert(
        "Failed to delete. You may not have permission or the word may not exist."
      );
    } finally {
      setDeletingWord(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Database Manager ({words.length})
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          {/* <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Search Finnish or English..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* The Table */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Finnish
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  English
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWords.map((word) => (
                <tr
                  key={word.id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {word.finnish}
                  </td>

                  {/* Highlight suspicious/empty translations */}
                  <td className="px-6 py-3 text-gray-600">
                    {word.english ? (
                      word.english
                    ) : (
                      <span className="text-red-500 text-sm font-bold bg-red-50 px-2 py-1 rounded">
                        MISSING
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3 text-gray-400 text-sm">
                    {word.categoryId || "-"}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingWord(word)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(word)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filteredWords.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No words found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reuse the Edit Modal */}
      {editingWord && (
        <EditWordModal
          word={editingWord}
          onClose={() => setEditingWord(null)}
          onSave={onWordUpdate}
          currentUser={currentUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingWord}
        word={deletingWord}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingWord(null)}
      />
    </div>
  );
};
