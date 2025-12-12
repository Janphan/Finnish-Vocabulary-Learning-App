// ==============================================
// AI-Enhanced Vocabulary Hook
// React hook to manage AI-generated examples
// ==============================================

import { useState, useEffect, useRef } from 'react';
import { VocabularyWord, AIGenerationOptions } from '../types';
import { callAIService } from '../services/aiService';
import { generateFallbackExample } from '../utils/fallbackExamples';
import { createBatchPrompt } from '../utils/promptUtils';

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

    // Call AI service
    const response = await callAIService(prompt, { service });
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