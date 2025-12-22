import { ReviewSession } from "./ReviewSession";

interface Props {
  sessionWords: any[];
  onGrade: (word: any, grade: number) => void;
  onBack: () => void;
  onWordUpdate?: (word: any) => void;
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
