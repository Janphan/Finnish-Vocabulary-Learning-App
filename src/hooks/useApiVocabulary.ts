// Simplified hook to load vocabulary directly from JSON files (no API server needed!)
import { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
export interface Category {
  id: string;
  name: string;
  count: number;
  emoji: string;
  description?: string;
}

export interface UseApiVocabularyResult {
  words: VocabularyWord[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getRandomWordsByCategory: (categoryId: string, count?: number) => Promise<VocabularyWord[]>;
}

export function useApiVocabulary(options: {
  categoryFilter?: string;
  difficultyFilter?: string;
  pageSize?: number;
} = {}): UseApiVocabularyResult {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate contextual and engaging Finnish example sentences
  const generateFinnishExample = (word: string, partOfSpeech: string, english: string, categories: string[] = []): string => {
    const finnish = word.toLowerCase();
    const englishLower = english.toLowerCase();
    
    // Helper function to get random example from array
    const randomExample = (examples: string[]) => examples[Math.floor(Math.random() * examples.length)];
    
    // Category-based contextual examples
    if (categories.length > 0) {
      // Find semantic category (skip part-of-speech categories)
      const semanticCategory = categories.find(cat => 
        cat !== 'noun' && cat !== 'verb' && cat !== 'adjective' && cat !== 'preposition'
      );
      
      if (semanticCategory) {
        switch (semanticCategory) {
        case 'Animals':
          if (partOfSpeech === 'noun') {
            const animalExamples = [
              `${word} elää metsässä.`,
              `Näin ${finnish}n eläintarhassa.`,
              `${word} on kaunis eläin.`,
              `Lapseni rakastaa ${finnish}ä.`,
              `${word} syöksyy nopeasti.`,
              `${word} leikkii ulkona.`
            ];
            return randomExample(animalExamples);
          }
          if (partOfSpeech === 'verb') {
            const animalVerbExamples = [
              `Eläimet ${finnish}vät luonnossa.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)}n eläimiä.`,
              `Haluan ${finnish} vähän.`
            ];
            return randomExample(animalVerbExamples);
          }
          break;
          
        case 'Food & Drink':
          if (partOfSpeech === 'noun') {
            const foodExamples = [
              `${word} on herkullista.`,
              `Ostan ${finnish}a kaupasta.`,
              `Äitini laittaa ${finnish}a.`,
              `${word} on terveellistä ruokaa.`,
              `Syön ${finnish}a mielellä.`,
              `${word} maistuu hyvältä.`
            ];
            return randomExample(foodExamples);
          }
          break;
          
        case 'Family & People':
          if (partOfSpeech === 'noun') {
            const familyExamples = [
              `${word} asuu Helsingissä.`,
              `Rakas ${finnish}ni soittaa illalla.`,
              `${word} on hyvin tärkeä minulle.`,
              `Tapaan ${finnish}n huomenna.`,
              `${word} hymyilee aina.`,
              `${word} on kiltti ihminen.`
            ];
            return randomExample(familyExamples);
          }
          break;
          
        case 'Nature & Weather':
          if (partOfSpeech === 'noun') {
            const natureExamples = [
              `${word} paistaa kirkkaasti.`,
              `Katselen ${finnish}a ikkunasta.`,
              `${word} on kaunis tänään.`,
              `Retkeilen ${finnish}ssa.`,
              `${word} muuttuu hitaasti.`,
              `${word} rauhoittaa mieltä.`
            ];
            return randomExample(natureExamples);
          }
          break;
          
        case 'Emotions & Mental States':
          if (partOfSpeech === 'noun') {
            const emotionExamples = [
              `Tunnen suurta ${finnish}a.`,
              `${word} täyttää sydämeni.`,
              `${word} on voimakas tunne.`,
              `${word} tekee minut onnelliseksi.`,
              `${word} antaa toivoa.`,
              `${word} on tärkeä asia.`
            ];
            return randomExample(emotionExamples);
          }
          if (partOfSpeech === 'verb') {
            const emotionVerbExamples = [
              `${word.charAt(0).toUpperCase() + word.slice(1)}n sinua.`,
              `En osaa ${finnish}.`,
              `Haluan ${finnish} paremmin.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)}mme yhdessä.`
            ];
            return randomExample(emotionVerbExamples);
          }
          break;
          
        case 'Body':
          if (partOfSpeech === 'noun') {
            const bodyExamples = [
              `${word} sattuu vähän.`,
              `Pesen ${finnish}ni huolellisesti.`,
              `Minulla on kaunis ${finnish}.`,
              `${word} on tärkeä osa kehoa.`,
              `${word} liikkuu notkeasti.`,
              `Hoidan ${finnish}äni hyvin.`
            ];
            return randomExample(bodyExamples);
          }
          break;
          
        case 'Colors & Appearance':
          if (partOfSpeech === 'adjective') {
            const colorExamples = [
              `Auto on ${finnish}.`,
              `Pidän ${finnish}sta väristä.`,
              `Taivas on ${finnish} tänään.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)} on kaunis väri.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)} takki lämmittää.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)} kukkia puutarhassa.`
            ];
            return randomExample(colorExamples);
          }
          if (partOfSpeech === 'noun') {
            const appearanceExamples = [
              `${word} kiiltää auringossa.`,
              `${word} on miellyttävä näky.`,
              `Katson ${finnish}a ihaillen.`,
              `${word} on kaunis asia.`
            ];
            return randomExample(appearanceExamples);
          }
          break;
          
        case 'Time & Numbers':
          if (partOfSpeech === 'noun') {
            const timeExamples = [
              `${word} menee nopeasti.`,
              `${word} on tärkeää minulle.`,
              `Nautin tästä ${finnish}stä.`,
              `${word} tuo mukanaan muutoksia.`,
              `${word} kuluu hitaasti.`,
              `Odotan ${finnish}a innolla.`
            ];
            return randomExample(timeExamples);
          }
          if (partOfSpeech === 'adjective') {
            const timeAdjExamples = [
              `Se on ${finnish} asia.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)} hetki on arvokas.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)} päivä oli ihanteellinen.`
            ];
            return randomExample(timeAdjExamples);
          }
          break;

        case 'Basic Actions':
          if (partOfSpeech === 'verb') {
            const actionExamples = [
              `${word.charAt(0).toUpperCase() + word.slice(1)}n joka päivä.`,
              `Osaan ${finnish} hyvin.`,
              `Haluan ${finnish} enemmän.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)}mme yhdessä.`,
              `Opettelen ${finnish}maan.`,
              `${word.charAt(0).toUpperCase() + word.slice(1)}n mielelläni.`
            ];
            return randomExample(actionExamples);
          }
          break;

        case 'Work & Education':
          if (partOfSpeech === 'noun') {
            const workExamples = [
              `${word} on kiinnostava ala.`,
              `Opiskelen ${finnish}a yliopistossa.`,
              `${word} vaatii keskittymistä.`,
              `Työskentelen ${finnish}n parissa.`,
              `${word} on tärkeä ammatti.`
            ];
            return randomExample(workExamples);
          }
          break;

        case 'Transportation':
          if (partOfSpeech === 'noun') {
            const transportExamples = [
              `${word} saapuu ajallaan.`,
              `Matkustan ${finnish}lla töihin.`,
              `${word} on nopea kulkuväline.`,
              `Odottelen ${finnish}a pysäkillä.`,
              `${word} vie minut perille.`
            ];
            return randomExample(transportExamples);
          }
          break;

        case 'Home & Living':
          if (partOfSpeech === 'noun') {
            const homeExamples = [
              `${word} on kodissa.`,
              `Siivoan ${finnish}n huolellisesti.`,
              `${word} kuuluu kotiin.`,
              `Käytän ${finnish}a päivittäin.`,
              `${word} tekee kodista viihtyisän.`
            ];
            return randomExample(homeExamples);
          }
          break;
        }
      }
    }
    
    // Enhanced part-of-speech based examples
    switch(partOfSpeech) {
      case 'noun':
        // Person-related nouns
        if (englishLower.includes('person') || englishLower.includes('man') || englishLower.includes('woman') || 
            englishLower.includes('child') || englishLower.includes('mother') || englishLower.includes('father')) {
          const personExamples = [
            `${word} on mukava ihminen.`,
            `Tunnen ${finnish}n hyvin.`,
            `${word} asuu naapurissa.`,
            `Puhun ${finnish}n kanssa usein.`
          ];
          return randomExample(personExamples);
        }
        
        // Object/thing nouns
        if (englishLower.includes('house') || englishLower.includes('car') || englishLower.includes('book') || 
            englishLower.includes('phone') || englishLower.includes('computer')) {
          const objectExamples = [
            `${word} on kallis.`,
            `Käytän ${finnish}a päivittäin.`,
            `${word} on minun lempi${finnish}ni.`,
            `Ostan uuden ${finnish}n.`
          ];
          return randomExample(objectExamples);
        }
        
        // Abstract nouns
        if (englishLower.includes('love') || englishLower.includes('happiness') || englishLower.includes('freedom') ||
            englishLower.includes('peace') || englishLower.includes('knowledge')) {
          const abstractExamples = [
            `${word} on tärkeää elämässä.`,
            `Etsin ${finnish}a.`,
            `${word} antaa voimaa.`,
            `${word} tuo rauhaa mieleen.`
          ];
          return randomExample(abstractExamples);
        }
        
        // Better default noun examples based on length and patterns
        const defaultNounExamples = [
          `${word} on tärkeä asia.`,
          `Katson ${finnish}a mielenkiinnolla.`,
          `${word} kuuluu jokapäiväiseen elämään.`,
          `Opettelen ${finnish}n merkitystä.`,
          `${word} on hyödyllinen sana.`,
          `Käytän ${finnish}a usein.`
        ];
        return randomExample(defaultNounExamples);
        
      case 'verb':
        // Movement verbs
        if (englishLower.includes('run') || englishLower.includes('walk') || englishLower.includes('jump') || 
            englishLower.includes('swim') || englishLower.includes('fly')) {
          const movementExamples = [
            `Haluan ${finnish} puistossa.`,
            `Osaan ${finnish} hyvin.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)}mme yhdessä.`,
            `Opettelen ${finnish}mään.`
          ];
          return randomExample(movementExamples);
        }
        
        // Communication verbs
        if (englishLower.includes('speak') || englishLower.includes('talk') || englishLower.includes('listen') || 
            englishLower.includes('read') || englishLower.includes('write')) {
          const communicationExamples = [
            `${word.charAt(0).toUpperCase() + word.slice(1)}n suomea joka päivä.`,
            `Haluan ${finnish} paremmin.`,
            `Opettaja ${finnish}e selkeästi.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)}mme yhdessä.`
          ];
          return randomExample(communicationExamples);
        }
        
        // Feeling/thinking verbs
        if (englishLower.includes('feel') || englishLower.includes('think') || englishLower.includes('understand') || 
            englishLower.includes('know') || englishLower.includes('remember')) {
          const mentalExamples = [
            `${word.charAt(0).toUpperCase() + word.slice(1)}n sinua.`,
            `En ${finnish} vielä.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)}n tämän asian.`,
            `Yritän ${finnish}.`
          ];
          return randomExample(mentalExamples);
        }
        
        // Better default verb examples with proper Finnish grammar
        const defaultVerbExamples = [
          `Yritän ${finnish}.`,
          `Osaan ${finnish} vähän.`,
          `Haluan oppia ${finnish}mään.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)}minen on tärkeää.`,
          `Harjoittelen ${finnish}mistä.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)}n huolellisesti.`
        ];
        return randomExample(defaultVerbExamples);
        
      case 'adjective':
        // Size adjectives
        if (englishLower.includes('big') || englishLower.includes('small') || englishLower.includes('large') || 
            englishLower.includes('tiny') || englishLower.includes('huge')) {
          const sizeExamples = [
            `Talo on ${finnish}.`,
            `Se on todella ${finnish}.`,
            `Minulla on ${finnish} koti.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)} koira juoksee.`
          ];
          return randomExample(sizeExamples);
        }
        
        // Quality adjectives
        if (englishLower.includes('good') || englishLower.includes('bad') || englishLower.includes('beautiful') || 
            englishLower.includes('nice') || englishLower.includes('wonderful')) {
          const qualityExamples = [
            `Se on todella ${finnish}.`,
            `Minulla on ${finnish} päivä.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)} mieli tekee hymyillä.`,
            `Elämä on ${finnish}.`
          ];
          return randomExample(qualityExamples);
        }
        
        // Better default adjective examples
        const defaultAdjExamples = [
          `Se on todella ${finnish}.`,
          `Minulla on ${finnish} mieli.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)} päivä odottaa.`,
          `Elämä on ${finnish}.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)} kokemus opettaa.`,
          `Tunnen oloni ${finnish}ksi.`
        ];
        return randomExample(defaultAdjExamples);
        
      case 'preposition':
        const prepositionExamples = [
          `Sana "${finnish}" yhdistää sanoja.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)} on tärkeä sana.`,
          `Käytän "${finnish}" lauseessa.`,
          `${word.charAt(0).toUpperCase() + word.slice(1)} auttaa ymmärtämään.`
        ];
        return randomExample(prepositionExamples);
        
      default:
        return `Sana "${finnish}" on hyödyllinen.`;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🤖 Loading AI-enhanced vocabulary with 3,450 examples...');
      
      // Try to load AI-enhanced version first (78% complete with examples)
      let vocabularyData;
      let dataSource = 'AI-enhanced';
      
      try {
        const aiResponse = await fetch('/finnish-vocab-ai-enhanced.json');
        if (aiResponse.ok) {
          vocabularyData = await aiResponse.json();
          console.log(`🤖 Loaded ${vocabularyData.length} words from AI-enhanced dataset (78% with examples)`);
        } else {
          throw new Error('AI-enhanced version not found');
        }
      } catch {
        // Fallback to regular cleaned version
        console.log('📚 Falling back to cleaned dataset...');
        const response = await fetch('/finnish-vocab-cleaned.json');
        if (!response.ok) {
          throw new Error(`Failed to load vocabulary: ${response.status}`);
        }
        vocabularyData = await response.json();
        dataSource = 'cleaned';
        console.log(`📚 Loaded ${vocabularyData.length} words from cleaned dataset`);
      }
      
      // Process vocabulary data
      const processedWords: VocabularyWord[] = vocabularyData.map((item: any, index: number) => {
        // Get primary category from categories array or fallback
        const primaryCategory = Array.isArray(item.categories) && item.categories.length > 0 
          ? item.categories[0] 
          : item.categoryId || 'general';
        
        // Map CEFR levels to difficulty
        const mapCEFRToDifficulty = (cefr: string) => {
          if (['A1', 'A2'].includes(cefr)) return 'beginner';
          if (['B1', 'B2'].includes(cefr)) return 'intermediate';
          if (['C1', 'C2'].includes(cefr)) return 'advanced';
          return 'beginner';
        };
        
        // Use AI/fallback example if available, otherwise generate one
        let example = item.example;
        if (!example) {
          example = generateFinnishExample(item.finnish, item.partOfSpeech, item.english, item.categories);
        }
        
        return {
          id: item.id || `vocab-${index}`,
          finnish: item.finnish,
          english: item.english,
          categoryId: primaryCategory,
          categories: item.categories || [primaryCategory],
          pronunciation: item.pronunciation,
          partOfSpeech: item.partOfSpeech,
          difficulty: item.cefr ? mapCEFRToDifficulty(item.cefr) : (item.difficulty || 'beginner'),
          frequency: item.frequency || 50,
          example: example,
          examples: item.examples || [],
          cefr: item.cefr, // Keep CEFR level for advanced sorting
          // Add AI metadata for transparency
          aiGenerated: item.aiGenerated || false,
          fallbackUsed: item.fallbackUsed || false,
          aiService: item.aiService || null
        };
      });

      // Apply filters
      let filteredWords = processedWords;
      
      if (options.categoryFilter && options.categoryFilter !== 'all') {
        filteredWords = filteredWords.filter(word => 
          word.categories && word.categories.includes(options.categoryFilter!)
        );
      }
      
      if (options.difficultyFilter && options.difficultyFilter !== 'all') {
        filteredWords = filteredWords.filter(word => word.difficulty === options.difficultyFilter);
      }
      
      if (options.pageSize) {
        filteredWords = filteredWords.slice(0, options.pageSize);
      }

      // Sort by CEFR levels for better learning progression
      const cefrOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
      filteredWords.sort((a, b) => {
        const aLevel = cefrOrder[a.cefr as keyof typeof cefrOrder] || 99;
        const bLevel = cefrOrder[b.cefr as keyof typeof cefrOrder] || 99;
        return aLevel - bLevel;
      });

      setWords(filteredWords);
      
      // Generate categories with counts - count ALL categories that appear in vocabulary
      const categoryMap = new Map<string, number>();
      processedWords.forEach(word => {
        // Count each category the word belongs to
        if (word.categories && Array.isArray(word.categories)) {
          word.categories.forEach((category: string) => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          });
        } else if (word.categoryId) {
          // Fallback for words without categories array
          categoryMap.set(word.categoryId, (categoryMap.get(word.categoryId) || 0) + 1);
        }
      });

      const categoryEmojiMap: Record<string, string> = {
        // Our new semantic categories
        'Family & People': '👨‍👩‍👧‍👦',
        'Time & Numbers': '⏰',
        'Basic Actions': '🏃',
        'Nature & Weather': '🌦️',
        'Colors & Appearance': '🎨',
        'Body': '👤',
        'Food & Drink': '🍽️',
        'Animals': '🐾',
        'Work & Education': '🎓',
        'Transportation': '🚗',
        'Emotions & Mental States': '😊',
        'Home & Living': '🏠',
        
        // Part of speech categories  
        'noun': '📦',
        'verb': '🏃',
        'adjective': '🎨',
        'adverb': '⚡',
        'pronoun': '👤',
        'proper_noun': '🏷️',
        'preposition': '🔗',
        'interjection': '❗',
        
        // Legacy categories (fallback)
        'Family': '👨‍👩‍👧‍👦',
        'People': '👥',
        'Anatomy': '👤',
        'Food': '🍎',
        'Cooking': '🍳',
        'Sports': '⚽',
        'Music': '🎵',
        'Clothing': '👕',
        'Colors': '🌈',
        'Emotions': '😊',
        'Home': '🏠',
        'Weather': '☁️',
        'Time': '⏰',
        'Education': '🎓',
        'Work': '💼',
        'Chemistry': '⚗️',
        'Medicine': '🎭',
        'Computing': '💻',
        'Law': '⚖️',
        'Mathematics': '🗿',
        'Physics': '⚛️',
        'Biology': '🧬',
        'Botany': '🌿',
        'Astronomy': '🔭',
        'Geography': '🌍',
        'Military': '🪖',
        'Nautical': '⚓',
        'Geology': '🧯',
        'Linguistics': '🗣️',
        'Grammar': '📝',
        'Mushrooms': '🍄',
        
        // Fallback
        'general': '📚'
      };

      const generatedCategories: Category[] = Array.from(categoryMap.entries()).map(([id, count]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        count,
        emoji: categoryEmojiMap[id] || '📖',
        description: `${count} words in ${id} category`
      }));

      setCategories(generatedCategories);
      
      // Show statistics about examples
      if (dataSource === 'AI-enhanced') {
        const aiCount = processedWords.filter(w => w.aiGenerated).length;
        const fallbackCount = processedWords.filter(w => w.fallbackUsed).length;
        const exampleCount = processedWords.filter(w => w.example).length;
        
        console.log(`✨ AI Examples loaded:`);
        console.log(`   🤖 AI-generated: ${aiCount} words`);
        console.log(`   🔄 Smart fallbacks: ${fallbackCount} words`);
        console.log(`   📝 Total with examples: ${exampleCount} words (${Math.round(exampleCount/processedWords.length*100)}%)`);
      }
      
      console.log(`✅ Vocabulary loaded successfully: ${filteredWords.length} words displayed, ${generatedCategories.length} categories`);
      
    } catch (err) {
      console.error('❌ Failed to load vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const getRandomWordsByCategory = async (categoryId: string, count: number = 20): Promise<VocabularyWord[]> => {
    const categoryWords = words.filter(word => 
      word.categories && word.categories.includes(categoryId)
    );
    const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchData();
  }, [options.categoryFilter, options.difficultyFilter]);

  return {
    words,
    categories,
    loading,
    error,
    refresh: fetchData,
    getRandomWordsByCategory
  };
}