import { ReviewSession } from "./ReviewSession";

interface Props {
  sessionWords: any[]; // Replace with VocabularyWord[]
  onGrade: (word: any, grade: number) => void; // Replace with proper types
  onBack: () => void;
  onWordUpdate?: (word: any) => void; // Add this prop
}

export const ReviewView = ({
  sessionWords,
  onGrade,
  onBack,
  onWordUpdate,
}: Props) => (
  <ReviewSession
    words={sessionWords}
    onGrade={onGrade}
    onBack={onBack}
    onWordUpdate={onWordUpdate}
  />
);
