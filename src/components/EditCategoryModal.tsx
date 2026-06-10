import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Category } from "../types";
import { X, Save, Loader2 } from "lucide-react";

interface Props {
  category: Category;
  onClose: () => void;
  onSave: (updatedCategory: Category) => void;
}

export const EditCategoryModal = ({ category, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState({
    name: category.name,
    emoji: category.emoji || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name) return;

    setLoading(true);
    try {
      const categoryRef = doc(db, "categories", category.id);

      const updates = {
        name: formData.name,
        emoji: formData.emoji,
      };

      await updateDoc(categoryRef, updates);

      onSave({ ...category, ...updates });
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to save category. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Category</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Category Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 bg-blue-50 border-blue-100 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Emoji
            </label>
            <input
              value={formData.emoji}
              onChange={(e) =>
                setFormData({ ...formData, emoji: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
        </div>

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