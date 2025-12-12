import React, { useState, useMemo } from "react";
import { VocabularyWord } from "../App";

interface PracticeQuizProps {
  words: VocabularyWord[];
  language?: "en" | "fi";
  onQuizComplete?: () => void; // Add this
}

function getRandomChoices(
  words: VocabularyWord[],
  correct: VocabularyWord,
  count = 4
): VocabularyWord[] {
  const others = words.filter((w) => w.id !== correct.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const choices = [correct, ...shuffled.slice(0, count - 1)];
  return choices.sort(() => Math.random() - 0.5);
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({
  words,
  onQuizComplete,
}) => {
  // console.log("PracticeQuiz rendered with words:", words);
  // console.log("Words length:", words?.length);
  // console.log("Words received in PracticeQuiz:", words.length, words); // Add this line

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false); // Add this

  if (!words || words.length < 4) {
    console.log("Not enough words for practice. Words:", words);
    return (
      <div>
        Not enough words for practice. Need at least 4 words, but got{" "}
        {words?.length || 0}.
      </div>
    );
  }

  const correctWord = words[current];

  // 👍 Correct: regenerate choices whenever the question changes
  const choices = useMemo(() => {
    return getRandomChoices(words, correctWord);
  }, [current]); // <-- only depends on current index

  const handleSelect = (id: string) => {
    setSelected(id);
    setShowResult(true);
    if (id === correctWord.id) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    if (current < words.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
      onQuizComplete?.(); // Call only when truly finished
    }
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
        <p className="mb-4">
          Final Score: {score} / {words.length}
        </p>
        <button
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()} // Or navigate back
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Practice: Multiple Choice</h2>

      <div className="mb-6 text-center">
        <span className="text-gray-600">What is the English meaning of:</span>
        <div className="text-3xl font-semibold mt-2 mb-2">
          {correctWord.finnish}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {choices.map((choice) => {
          let highlight = "";

          if (!selected) {
            highlight =
              "bg-gray-50 border-gray-300 hover:bg-blue-50 text-gray-800";
          } else if (choice.id === correctWord.id) {
            highlight = "bg-green-100 border-green-500 text-green-800";
          } else if (choice.id === selected) {
            highlight = "bg-red-100 border-red-500 text-red-800";
          } else {
            highlight = "bg-gray-100 border-gray-300 text-gray-400";
          }

          return (
            <button
              key={choice.id}
              className={`w-full py-2 px-4 rounded-lg border text-lg transition-all ${highlight}`}
              disabled={!!selected}
              onClick={() => handleSelect(choice.id)}
            >
              {choice.english}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mb-4 text-center">
          {selected === correctWord.id ? (
            <span className="text-green-700 font-bold">Correct!</span>
          ) : (
            <span className="text-red-700 font-bold">
              Incorrect. The correct answer is: {correctWord.english}
            </span>
          )}
        </div>
      )}

      {selected && (
        <div className="flex justify-between items-center mt-6">
          <span>
            Score: {score} / {words.length}
          </span>
          <button
            className="py-2 px-4 bg-blue-600 text-black rounded-lg hover:bg-blue-700 cursor-pointer"
            onClick={handleNext}
          >
            {current < words.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
};
