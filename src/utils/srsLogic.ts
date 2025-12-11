import { VocabularyWord } from "../App";

export const calculateReview = (word: VocabularyWord, grade: number): Partial<VocabularyWord> => {
  // 1. Defaults for new words
  const currentInterval = word.interval || 0;
  const currentRepetitions = word.repetitions || 0;
  const currentEF = word.easinessFactor || 2.5;

  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;
  let newEF = currentEF;

  // 2. SM-2 Algorithm Logic
  if (grade >= 3) {
    // Correct answer (Good/Easy)
    if (currentRepetitions === 0) {
      newInterval = 1;
    } else if (currentRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * currentEF);
    }
    newRepetitions += 1;
  } else {
    // Incorrect/Hard answer: Reset progress
    newRepetitions = 0;
    newInterval = 1;
  }

  // 3. Update Easiness Factor (Math to adjust difficulty)
  newEF = currentEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  // 4. Calculate Next Date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easinessFactor: newEF,
    nextReviewDate: nextDate.toISOString()
  };
};