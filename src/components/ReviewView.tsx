import { ReviewSession } from "./ReviewSession";

interface Props {
  sessionWords: any[];
  onGrade: (word: any, grade: number) => void;
  onBack: () => void;
}

export const ReviewView = ({
  sessionWords,
  onGrade,
  onBack,
}: Props) => (
  <ReviewSession
    words={sessionWords}
    onGrade={onGrade}
    onBack={onBack}
  />
);
