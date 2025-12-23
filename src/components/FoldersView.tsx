import React from "react";
import { ArrowLeft } from "lucide-react";
import { FolderManager } from "./FolderManager";
import { translations, Language } from "../utils/translations";

interface Props {
  folders: any[];
  favorites: Set<string>;
  vocabularyWords: any[];
  language: Language;
  onBack: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const FoldersView = ({
  folders,
  favorites,
  vocabularyWords,
  language,
  onBack,
  onCreateFolder,
  onDeleteFolder,
}: Props) => {
  const t = translations[language];

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-gray-900">{t.myFolders}</h1>
              <p className="text-gray-500 text-sm">{t.organizeVocabulary}</p>
            </div>
          </div>
        </div>
      </div>
      <FolderManager
        folders={folders}
        favorites={favorites}
        vocabularyWords={vocabularyWords}
        onCreateFolder={onCreateFolder}
        onDeleteFolder={onDeleteFolder}
      />
    </>
  );
};
