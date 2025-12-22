import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path matches your setup
import { VocabularyWord } from "../types";
import { X, Save, Loader2 } from "lucide-react";

interface Props {
  word: VocabularyWord;
  onClose: () => void;
  onSave: (updatedWord: VocabularyWord) => void;
  currentUser: any;
}

export const EditWordModal = ({
  word,
  onClose,
  onSave,
  currentUser,
}: Props) => {
  const [formData, setFormData] = useState({
    finnish: word.finnish,
    english: word.english,
    category: word.categoryId || "",
    exampleSentence: word.exampleSentence || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.finnish || !formData.english) return;
    if (!currentUser) {
      alert("You must be logged in to edit words.");
      return;
    }

    setLoading(true);
    try {
      // 1. Update Firestore
      const wordRef = doc(db, "vocabulary", word.id);

      // We explicitly list fields to avoid overwriting SRS stats (interval, etc.)
      const updates = {
        finnish: formData.finnish,
        english: formData.english,
        category: formData.category,
        exampleSentence: formData.exampleSentence,
      };

      await updateDoc(wordRef, updates);

      // 2. Update Local App State
      onSave({ ...word, ...updates });
      onClose();
    } catch (error) {
      console.error("Error updating word:", error);
      alert("Failed to save. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Flashcard</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Finnish
              </label>
              <input
                value={formData.finnish}
                onChange={(e) =>
                  setFormData({ ...formData, finnish: e.target.value })
                }
                className="w-full p-3 bg-blue-50 border-blue-100 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                English
              </label>
              <input
                value={formData.english}
                onChange={(e) =>
                  setFormData({ ...formData, english: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Example Sentence
            </label>
            <textarea
              value={formData.exampleSentence}
              onChange={(e) =>
                setFormData({ ...formData, exampleSentence: e.target.value })
              }
              rows={2}
              className="w-full p-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Optional example..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Category (Optional)
            </label>
            <input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-black font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
