import { VocabularyWord, UserFolder } from '../App';
import { X, Check } from 'lucide-react';

interface AddToFolderModalProps {
  word: VocabularyWord;
  folders: UserFolder[];
  onAddToFolder: (wordId: string, folderId: string) => void;
  onClose: () => void;
}

export function AddToFolderModal({
  word,
  folders,
  onAddToFolder,
  onClose,
}: AddToFolderModalProps) {
  const handleAddToFolder = (folderId: string) => {
    onAddToFolder(word.id, folderId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900">Add to Folder</h2>
            <p className="text-gray-500 text-sm">{word.finnish}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No folders yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Create a folder from the Folders page
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder) => {
              const isInFolder = folder.wordIds.includes(word.id);
              return (
                <button
                  key={folder.id}
                  onClick={() => handleAddToFolder(folder.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all active:scale-98 text-left flex items-center justify-between ${
                    isInFolder
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="text-gray-900">{folder.name}</div>
                    <div className="text-gray-500 text-sm">
                      {folder.wordIds.length} words
                    </div>
                  </div>
                  {isInFolder && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
