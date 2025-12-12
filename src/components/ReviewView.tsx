import React from "react";
import { ReviewSession } from "./ReviewSession";

interface Props {
  sessionWords: any[]; // Replace with VocabularyWord[]
  onGrade: (word: any, grade: number) => void; // Replace with proper types
  onBack: () => void;
}

export const ReviewView = ({ sessionWords, onGrade, onBack }: Props) => (
  <ReviewSession words={sessionWords} onGrade={onGrade} onBack={onBack} />
);
