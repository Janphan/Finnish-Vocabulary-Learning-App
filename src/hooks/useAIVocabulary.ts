// ==============================================
// AI-Enhanced Vocabulary Hook
// React hook to manage AI-generated examples
// ==============================================

import { useState, useEffect, useRef } from 'react';

interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  partOfSpeech: string;
  categories?: string[];
  example?: string;
  aiGenerated?: boolean;
  fallbackUsed?: boolean;
  generatedAt?: string;
  aiService?: string;
}

interface AIGenerationOptions {
  batchSize?: number;
  service?: 'openai' | 'claude' | 'azure' | 'mock';
  autoGenerate?: boolean;
  preferAI?: boolean;
}

// Custom hook for AI-enhanced vocabulary
export function useAIVocabulary(options: AIGenerationOptions = {}) {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generationProgress, setGenerationProgress] = useState({
    total: 0,
    processed: 0,
    isGenerating: false
  });
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const {
    batchSize = 20,
    service = 'mock',
    autoGenerate = false,
    preferAI = true
  } = options;

  // Load vocabulary data
  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load AI-enhanced version first
      let data: VocabularyWord[];
      
      if (preferAI) {
        try {
          const aiResponse = await fetch('/finnish-vocab-ai-enhanced.json');
          if (aiResponse.ok) {
            data = await aiResponse.json();
            console.log('📚 Loaded AI-enhanced vocabulary');
          } else {
            throw new Error('AI-enhanced version not found');
          }
        } catch {
          // Fallback to regular version
          const response = await fetch('/finnish-vocab-cleaned.json');
          data = await response.json();
          console.log('📚 Loaded standard vocabulary');
        }
      } else {
        const response = await fetch('/finnish-vocab-cleaned.json');
        data = await response.json();
      }
      
      setVocabulary(data);
      
      // Check if auto-generation is needed
      const needsGeneration = data.filter(word => !word.example || !word.aiGenerated);
      if (autoGenerate && needsGeneration.length > 0) {
        console.log(`🤖 Auto-generating examples for ${needsGeneration.length} words`);
        await generateMissingExamples();
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  // Generate examples for words without AI examples
  const generateMissingExamples = async () => {
    const wordsNeedingExamples = vocabulary.filter(word => !word.example || !word.aiGenerated);
    
    if (wordsNeedingExamples.length === 0) {
      console.log('✅ All words already have AI-generated examples');
      return;
    }
    
    setGenerationProgress({
      total: wordsNeedingExamples.length,
      processed: 0,
      isGenerating: true
    });
    
    abortControllerRef.current = new AbortController();
    
    try {
      await generateExamplesInBatches(wordsNeedingExamples);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(`Generation failed: ${err.message}`);
      }
    } finally {
      setGenerationProgress(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // Process words in batches
  const generateExamplesInBatches = async (words: VocabularyWord[]) => {
    const batches = [];
    for (let i = 0; i < words.length; i += batchSize) {
      batches.push(words.slice(i, i + batchSize));
    }
    
    for (let i = 0; i < batches.length; i++) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Generation aborted');
      }
      
      const batch = batches[i];
      
      try {
        const examples = await generateExamplesForBatch(batch);
        
        // Update vocabulary state
        setVocabulary(prev => prev.map(word => {
          const updatedWord = examples.find(e => e.id === word.id);
          return updatedWord || word;
        }));
        
        setGenerationProgress(prev => ({
          ...prev,
          processed: prev.processed + batch.length
        }));
        
        // Delay between batches to respect API limits
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (err) {
        console.error(`Failed to generate examples for batch ${i + 1}:`, err);
        
        // Use fallback examples for failed batch
        const fallbackExamples = batch.map(word => ({
          ...word,
          example: generateFallbackExample(word),
          aiGenerated: false,
          fallbackUsed: true,
          generatedAt: new Date().toISOString()
        }));
        
        setVocabulary(prev => prev.map(word => {
          const fallbackWord = fallbackExamples.find(e => e.id === word.id);
          return fallbackWord || word;
        }));
      }
    }
  };

  // Generate examples for a batch using AI service
  const generateExamplesForBatch = async (batch: VocabularyWord[]): Promise<VocabularyWord[]> => {
    const prompt = createBatchPrompt(batch);
    
    // Mock AI call - replace with actual service
    const response = await callAIService(prompt);
    const examples = response.trim().split('\n').filter(line => line.length > 0);
    
    return batch.map((word, index) => ({
      ...word,
      example: examples[index] || generateFallbackExample(word),
      aiGenerated: !!examples[index],
      fallbackUsed: !examples[index],
      generatedAt: new Date().toISOString(),
      aiService: service
    }));
  };

  // Create AI prompt for batch
  const createBatchPrompt = (batch: VocabularyWord[]): string => {
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

  // Mock AI service call - replace with actual implementation
  const callAIService = async (prompt: string): Promise<string> => {
    // This is where you'd call your chosen AI service
    // For now, returning mock responses
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lines = prompt.split('\n').filter(line => /^\d+\./.test(line.trim()));
    const count = lines.length;
    
    const mockExamples = [
      'Minä olen opiskelija.',
      'Hän menee kouluun.',
      'Me asumme Helsingissä.',
      'Tämä on hyvä kirja.',
      'He puhuvat suomea.',
      'Sää on kaunis tänään.',
      'Ruoka on valmis nyt.',
      'Kissa nukkuu sohvalla.',
      'Auto on pysäköity pihalle.',
      'Lapset leikkivät puistossa.'
    ];
    
    return mockExamples.slice(0, count).join('\n');
  };

  // Generate fallback example
  const generateFallbackExample = (word: VocabularyWord): string => {
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
    
    switch (partOfSpeech.toLowerCase()) {
      case 'noun': return `${finnish} on hyödyllinen asia.`;
      case 'verb': return `Minä ${finnish}.`;
      case 'adjective': return `Se on ${finnish}.`;
      case 'adverb': return `Hän tekee sen ${finnish}.`;
      default: return `${finnish} on tärkeä sana.`;
    }
  };

  // Stop generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Regenerate specific word example
  const regenerateExample = async (wordId: string) => {
    const word = vocabulary.find(w => w.id === wordId);
    if (!word) return;
    
    try {
      const [updatedWord] = await generateExamplesForBatch([word]);
      setVocabulary(prev => prev.map(w => w.id === wordId ? updatedWord : w));
    } catch (err) {
      console.error('Failed to regenerate example:', err);
    }
  };

  return {
    vocabulary,
    loading,
    error,
    generationProgress,
    actions: {
      generateMissingExamples,
      stopGeneration,
      regenerateExample,
      reload: loadVocabulary
    }
  };
}

export default useAIVocabulary;