import { useState, useEffect } from "react";
import { ArrowLeft, Check, Brain, HelpCircle } from "lucide-react";
import { VocabularyWord } from "../types";

interface Props {
  words: VocabularyWord[];
  onGrade: (word: VocabularyWord, grade: number) => void;
  onBack: () => void;
  onReviewAgain: () => void;
}

export const ReviewSession = ({ words, onGrade, onBack, onReviewAgain }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false); // Help modal state
  const [touchStartX, setTouchStartX] = useState(0);

  const currentWord = words[currentIndex];

  const handleGrade = (grade: number) => {
    if (!currentWord) return;
    onGrade(currentWord, grade); // Update Logic
    setIsFlipped(false);
    setTouchStartX(0);

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setComplete(true);
    }
  };

  // Keyboard controls for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (words.length === 0 || complete) return; // Prevent keyboard actions if session is empty or done
      if (!isFlipped) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault(); // Prevent scrolling
          setIsFlipped(true);
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        handleGrade(1); // Forgot
      } else if (e.key === 'ArrowRight') {
        handleGrade(4); // Known
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, words, complete]); // Dependencies ensure latest handleGrade closure

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
        <div className="bg-yellow-100 p-6 rounded-full mb-6 animate-bounce">
          <span className="text-6xl">🎉</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Congratulations!
        </h2>
        <p className="text-gray-600 mb-8 max-w-sm text-lg">
          You've completed your review session. Keep up the great work!
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={onReviewAgain}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Review Again
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl font-bold shadow-sm transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Simple Touch Swipe Handlers (No visual drag animation)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isFlipped || touchStartX === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;

    if (distance < -50) {
      handleGrade(4); // Swipe Right -> Known
    } else if (distance > 50) {
      handleGrade(1); // Swipe Left -> Forgot
    }
    setTouchStartX(0);
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
        onClick={() => !isFlipped && setIsFlipped(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
        className="relative flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-6 min-h-[250px] md:min-h-[300px]"
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
          <p className="text-center text-sm text-gray-600 mb-2">
            Did you remember it correctly?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleGrade(1)}
              className="flex-1 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl font-semibold shadow-sm transform active:scale-95 transition-all duration-200"
            >
              ❌ Forgot
            </button>
            <button
              onClick={() => handleGrade(4)}
              className="flex-1 py-3 bg-green-100 text-green-700 hover:bg-green-200 rounded-2xl font-semibold shadow-sm transform active:scale-95 transition-all duration-200"
            >
              ✅ Known
            </button>
          </div>
        </div>
      ) : (
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-2xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Show Answer
            <span className="hidden sm:inline font-normal text-gray-300 ml-2 text-sm">(Press Space)</span>
          </button>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="font-bold mb-4">How Grading Works</h3>
            <p className="text-sm mb-4">
              Once you reveal the answer, evaluate your memory:
            </p>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Space / Enter:</strong> Flip the card to show the answer.
              </li>
              <li>
                <strong>Swipe Left / ← Arrow (Forgot):</strong> You'll see this word again tomorrow.
              </li>
              <li>
                <strong>Swipe Right / → Arrow (Known):</strong> The interval before the next review increases.
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
