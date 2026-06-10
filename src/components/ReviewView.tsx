import { VocabularyWord } from "../types";
import { ReviewSession } from "./ReviewSession";

interface Props {
  sessionWords: VocabularyWord[];
  onGrade: (word: VocabularyWord, status: "known" | "forgot") => void;
  onBack: () => void;
  onReviewAgain: () => void;
}

export const ReviewView = ({
  sessionWords,
  onGrade,
  onBack,
  onReviewAgain,
}: Props) => (
  <ReviewSession
    words={sessionWords}
    onGrade={onGrade}
    onBack={onBack}
    onReviewAgain={onReviewAgain}
  />
);
