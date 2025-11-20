import { useState } from 'react';
import { UserFolder, VocabularyWord } from '../App';
import { Plus, Trash2, Star, Folder as FolderIcon } from 'lucide-react';

interface FolderManagerProps {
  folders: UserFolder[];
  favorites: Set<string>;
  vocabularyWords: VocabularyWord[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderManager({
  folders,
  favorites,
  vocabularyWords,
  onCreateFolder,
  onDeleteFolder,
}: FolderManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      setShowCreateModal(false);
    }
  };

  const getWordById = (wordId: string) => {
    return vocabularyWords.find((w) => w.id === wordId);
  };

  const favoriteWords = vocabularyWords.filter((word) => favorites.has(word.id));

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Favorites Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() =>
            setExpandedFolder(expandedFolder === 'favorites' ? null : 'favorites')
          }
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-gray-900">Favorites</h3>
              <p className="text-gray-600 text-sm">{favoriteWords.length} words</p>
            </div>
          </div>
        </div>

        {expandedFolder === 'favorites' && favoriteWords.length > 0 && (
          <div className="mt-4 space-y-2">
            {favoriteWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-lg p-3 flex justify-between items-center"
              >
                <div className="text-gray-900">{word.finnish}</div>
                <div className="text-gray-500 text-sm">{word.english}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Folder Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-blue-500 text-white rounded-xl p-4 shadow-sm hover:bg-blue-600 transition-colors active:scale-98 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Folder</span>
      </button>

      {/* User Folders */}
      {folders.length > 0 && (
        <div className="space-y-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpandedFolder(expandedFolder === folder.id ? null : folder.id)
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FolderIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{folder.name}</h3>
                    <p className="text-gray-500 text-sm">{folder.wordIds.length} words</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {expandedFolder === folder.id && folder.wordIds.length > 0 && (
                <div className="mt-4 space-y-2">
                  {folder.wordIds.map((wordId) => {
                    const word = getWordById(wordId);
                    if (!word) return null;
                    return (
                      <div
                        key={wordId}
                        className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="text-gray-900">{word.finnish}</div>
                        <div className="text-gray-500 text-sm">{word.english}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {folders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No custom folders yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create folders to organize your vocabulary
          </p>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <h2 className="text-gray-900 mb-4">Create New Folder</h2>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFolderName('');
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!folderName.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
