import { useState, useMemo } from "react";
import { Category } from "../types";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  categories: Category[];
}

export const CategoryManager = ({ categories }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(lower));
  }, [categories, searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Category Manager ({categories.length})
        </h2>
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full md:w-96 pl-4 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Emoji
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Word Count
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-blue-50/50 transition-colors group"
              >
                <td className="px-6 py-3 font-medium text-gray-900">
                  {cat.name}
                </td>
                <td className="px-6 py-3">{cat.emoji}</td>
                <td className="px-6 py-3 text-gray-600">{cat.count}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => alert("Edit functionality to be implemented.")}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert("Delete functionality to be implemented.")}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};