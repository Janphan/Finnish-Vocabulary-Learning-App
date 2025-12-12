import React from "react";
import { ArrowLeft, Brain, Check } from "lucide-react";
import { VocabularyWord } from "../types";

interface Props {
  onBack: () => void;
  onReviewSession: () => void;
  onQuickQuiz: () => void;
  dueWordsCount: number;
}

export const LearningView = ({
  onBack,
  onReviewSession,
  onQuickQuiz,
  dueWordsCount,
}: Props) => (
  <>
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Learning Activities
          </h1>
          <div></div> {/* Spacer */}
        </div>
      </div>
    </div>
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col gap-6">
        <div
          onClick={onReviewSession}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Review Session
              </h3>
              <p className="text-gray-600 text-sm">
                Practice words due for review ({dueWordsCount} due)
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={onQuickQuiz}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Quick Quiz</h3>
              <p className="text-gray-600 text-sm">
                Test your knowledge with random words
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
