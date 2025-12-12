import React from "react";
import { PracticeQuiz } from "../PracticeGame/PracticeQuiz";

interface Props {
  quizWords: any[]; // Replace with VocabularyWord[]
  allWords: any[]; // Replace with VocabularyWord[]
  onBack: () => void;
}

export const PracticeView = ({ quizWords, allWords, onBack }: Props) => (
  <div className="min-h-screen bg-white">
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
      >
        ← Back
      </button>
    </div>
    <PracticeQuiz
      words={
        quizWords.length > 0
          ? quizWords
          : allWords.length >= 20
          ? [...allWords].sort(() => Math.random() - 0.5).slice(0, 20)
          : allWords
      }
    />
  </div>
);
