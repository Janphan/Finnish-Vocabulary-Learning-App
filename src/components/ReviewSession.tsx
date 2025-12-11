import { useState } from "react";
import { VocabularyWord } from "../App";
import { ArrowLeft, Check, Brain } from "lucide-react";

interface Props {
  words: VocabularyWord[];
  onGrade: (word: VocabularyWord, grade: number) => void;
  onBack: () => void;
}

export const ReviewSession = ({ words, onGrade, onBack }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [complete, setComplete] = useState(false);

  // Scenario: No words due
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          All Caught Up!
        </h2>
        <p className="text-gray-600 mb-6">No reviews due right now.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Scenario: Session finished
  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <Brain className="w-12 h-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Session Complete!
        </h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium"
        >
          Finish
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleGrade = (grade: number) => {
    onGrade(currentWord, grade); // Update Logic
    setIsFlipped(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setComplete(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-500">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      {/* Flashcard Area */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer mb-8 min-h-[300px]"
      >
        <span className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">
          {isFlipped ? "English" : "Finnish"}
        </span>
        <h2 className="text-4xl font-bold text-gray-900">
          {isFlipped ? currentWord.english : currentWord.finnish}
        </h2>
        {!isFlipped && (
          <p className="text-sm text-gray-400 mt-8">(Tap to flip)</p>
        )}
      </div>

      {/* Grading Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleGrade(1)}
            className="p-4 bg-red-100 text-red-700 rounded-2xl font-bold"
          >
            Hard
          </button>
          <button
            onClick={() => handleGrade(3)}
            className="p-4 bg-blue-100 text-blue-700 rounded-2xl font-bold"
          >
            Good
          </button>
          <button
            onClick={() => handleGrade(5)}
            className="p-4 bg-green-100 text-green-700 rounded-2xl font-bold"
          >
            Easy
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsFlipped(true)}
          className="w-full p-4 bg-gray-900 text-white rounded-2xl font-bold"
        >
          Show Answer
        </button>
      )}
    </div>
  );
};
