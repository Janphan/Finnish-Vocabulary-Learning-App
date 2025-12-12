import { useState } from "react";
import { VocabularyWord } from "../App";
import { ArrowLeft, Check, Brain, HelpCircle } from "lucide-react";

interface Props {
  words: VocabularyWord[];
  onGrade: (word: VocabularyWord, grade: number) => void;
  onBack: () => void;
}

export const ReviewSession = ({ words, onGrade, onBack }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false); // Help modal state

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
          className="px-6 py-3 bg-blue-600 text-black rounded-xl font-medium"
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
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Flashcard Area */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer mb-8 min-h-[300px]"
      >
        <span className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">
          {isFlipped ? "English" : "Finnish"}
        </span>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {isFlipped ? currentWord.english : currentWord.finnish}
        </h2>
        {isFlipped && currentWord.exampleSentence && (
          <p className="text-gray-500 italic mt-4">
            "{currentWord.exampleSentence}"
          </p>
        )}
      </div>

      {/* Grading Buttons */}
      {isFlipped ? (
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-600 mb-4">
            How well did you know this word?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleGrade(1)}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-gray-900 rounded-full font-semibold shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
            >
              Hard
            </button>
            <button
              onClick={() => handleGrade(3)}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-gray-900 rounded-full font-semibold shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
            >
              Good
            </button>
            <button
              onClick={() => handleGrade(5)}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-gray-900 rounded-full font-semibold shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
            >
              Easy
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsFlipped(true)}
          className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-black rounded-2xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Show Answer
        </button>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="font-bold mb-4">How Grading Works</h3>
            <p className="text-sm mb-4">
              Rate each word based on difficulty. Lower ratings mean you'll see
              it sooner for practice.
            </p>
            <ul className="text-sm space-y-1">
              <li>
                <strong>1-2:</strong> Hard - Review soon
              </li>
              <li>
                <strong>3:</strong> Good - Standard interval
              </li>
              <li>
                <strong>4-5:</strong> Easy - Longer intervals
              </li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
