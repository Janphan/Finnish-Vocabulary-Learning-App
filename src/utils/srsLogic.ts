import { VocabularyWord } from "../types";

export const calculateReview = (word: VocabularyWord, status: "known" | "forgot"): Partial<VocabularyWord> => {
  // 1. Get default values if it's a completely new word
  const currentInterval = word.interval ?? 0;
  const currentRepetitions = word.repetitions ?? 0;
  const currentEF = word.easinessFactor ?? 2.5;

  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;
  let newEF = currentEF;

  const nextDate = new Date();

  // 2. Simplified SM-2 Algorithm Logic
  if (status === "known") {
    // Correct answer (Equivalent to Grade 4 in SM-2)
    if (currentRepetitions === 0) {
      newInterval = 1; // First time correct: review tomorrow
    } else if (currentRepetitions === 1) {
      newInterval = 6; // Second time correct: review in 6 days
    } else {
      // Third time onwards: multiply interval by Easiness Factor
      newInterval = Math.round(currentInterval * currentEF);
    }

    newRepetitions += 1; // Increase streak
    nextDate.setDate(nextDate.getDate() + newInterval); // Push forward by X days

    // Slightly increase EF for correctly remembering the word
    newEF = currentEF + 0.05;
  } else {
    // Incorrect answer (Forgot)
    newRepetitions = 0; // Reset streak
    newInterval = 0;    // Interval is 0 (will review again shortly)

    // Decrease EF as the word was difficult
    newEF = currentEF - 0.15;

    // Schedule to review in 5 minutes
    nextDate.setMinutes(nextDate.getMinutes() + 5);
  }

  // 3. Limit EF to reasonable bounds (SM-2 standard minimum is 1.3)
  if (newEF < 1.3) newEF = 1.3;
  // Prevent EF from growing too aggressively and pushing words too far
  if (newEF > 3.5) newEF = 3.5;

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easinessFactor: Number(newEF.toFixed(2)), // Round to 2 decimals for cleaner storage
    nextReviewDate: nextDate.toISOString()
  };
};