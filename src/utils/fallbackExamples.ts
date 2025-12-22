import { VocabularyWord } from '../types';

// Generate fallback example sentence
export const generateFallbackExample = (word: VocabularyWord): string => {
  const { finnish, partOfSpeech, categories } = word;

  if (categories && categories.length > 0) {
    const category = categories[0].toLowerCase();

    switch (category) {
      case 'family': return `${finnish} on perheenjäsen.`;
      case 'animals': return `${finnish} on eläin.`;
      case 'food': return `${finnish} on ruokaa.`;
      case 'nature': return `${finnish} on luonnossa.`;
      case 'body': return `${finnish} on kehon osa.`;
      case 'clothing': return `${finnish} on vaate.`;
      default: return `${finnish} on tärkeä sana.`;
    }
  }

  switch (typeof partOfSpeech === 'string' ? partOfSpeech.toLowerCase() : undefined) {
    case 'noun': return `${finnish} on hyödyllinen asia.`;
    case 'verb': return `Minä ${finnish}.`;
    case 'adjective': return `Se on ${finnish}.`;
    case 'adverb': return `Hän tekee sen ${finnish}.`;
    default: return `${finnish} on tärkeä sana.`;
  }
};