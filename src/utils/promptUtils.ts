// ==============================================
// Prompt Utilities
// Creates AI prompts for vocabulary generation
// ==============================================

import { VocabularyWord } from '../types';

// Create AI prompt for batch of words
export const createBatchPrompt = (batch: VocabularyWord[]): string => {
  const wordsData = batch.map(word => ({
    finnish: word.finnish,
    english: word.english,
    partOfSpeech: word.partOfSpeech,
    categories: word.categories || []
  }));

  return `You are a Finnish language expert. Generate natural, educational example sentences in Finnish for these vocabulary words. Each example should:
1. Use proper Finnish grammar and natural sentence structure
2. Be appropriate for language learners (A1-C2 levels)
3. Show the word in meaningful context
4. Be 3-8 words long
5. Help learners understand word usage

For each word, provide ONLY the Finnish example sentence, nothing else.

Words to process:
${wordsData.map((word, i) =>
  `${i + 1}. ${word.finnish} (${word.english}) - ${word.partOfSpeech}${word.categories.length > 0 ? `, categories: ${word.categories.join(', ')}` : ''}`
).join('\n')}

Respond with exactly ${batch.length} lines, each containing only the Finnish example sentence for the corresponding word:`;
};