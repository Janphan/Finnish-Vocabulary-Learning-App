import { VocabularyWord } from "../types";
export const getSmartSession = (
  allWords: VocabularyWord[],
  limit: number = 20
): VocabularyWord[] => {
  const today = Date.now();
  //Shuffle the groups independently
  // Replace biased random by Fisher-Yates method
  // (This ensures you see hard stuff, but the order changes every time)
  const shuffle = <T>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };
  const newWordsPool = allWords.filter(w => !w.nextReviewDate || (w.interval ?? 0) === 0);
  const learnedWordsPool = allWords.filter(w => w.nextReviewDate && (w.interval ?? 0) > 0);
  const dueLearnedWords = learnedWordsPool.filter(w => new Date(w.nextReviewDate!).getTime() <= today);
  const notDueLearnedWords = learnedWordsPool.filter(w => new Date(w.nextReviewDate!).getTime() > today);
  //Divide Due into 2 groups

  const hardWords = dueLearnedWords.filter(w => (w.interval ?? 0) < 3);
  const normalWords = dueLearnedWords.filter(w => (w.interval ?? 0) >= 3);
  //mix word for surprising and appealing effect
  const shuffledHardWords = shuffle(hardWords);
  const shuffledNormalWords = shuffle(normalWords);

  //Combine Review words, with hard word in priority
  let session = [...shuffledHardWords, ...shuffledNormalWords];
  //Boredom Killer: If not enough 20 words, add new words
  if (session.length < limit) {
    const shuffledNewWords = shuffle(newWordsPool);
    const needed = limit - session.length;
    session = [...session, ...shuffledNewWords.slice(0, needed)];
  }

  return session.slice(0, limit);
};