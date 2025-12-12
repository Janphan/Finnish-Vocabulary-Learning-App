import { VocabularyWord } from "../types";
export const getSmartSession = (
  allWords: VocabularyWord[], 
  limit: number = 20
): VocabularyWord[] => {
  // 1. Identify "Due" words
  const dueWords = allWords.filter(w => !w.nextReviewDate || new Date(w.nextReviewDate).getTime() <= Date.now());

  // 2. Separate "Hard" words (Interval < 3 days) from "Normal" reviews
  const hardWords = dueWords.filter(w => (w.interval || 0) < 3);
  const normalReviews = dueWords.filter(w => (w.interval || 0) >= 3);

  // 3. Shuffle the groups independently
  // (This ensures you see hard stuff, but the order changes every time)
  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);
  
  const shuffledHard = shuffle(hardWords);
  const shuffledNormal = shuffle(normalReviews);

  // 4. Combine: Hard stuff first, then normal reviews
  let session = [...shuffledHard, ...shuffledNormal];

  // 5. "Boredom Killer": Inject NEW words if the session is too short
  if (session.length < limit) {
    const newWords = allWords.filter(w => !w.nextReviewDate && !session.includes(w));
    const shuffledNew = shuffle(newWords);
    
    // Fill the remaining slots with new words
    const needed = limit - session.length;
    session = [...session, ...shuffledNew.slice(0, needed)];
  }

  // 6. Return only the batch size (e.g., 20)
  return session.slice(0, limit);
};