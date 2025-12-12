// @vitest-environment happy-dom
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// We don't import the hook statically here to allow resetting modules
// import { useApiVocabulary } from './useApiVocabulary';

const mockData1 = [
  { id: '1', finnish: 'koira', english: 'dog', cefr: 'B1' },
  { id: '2', finnish: 'kissa', english: 'cat', cefr: 'A1' },
  { id: '3', finnish: 'hevonen', english: 'horse', cefr: 'C1' },
  { id: '4', finnish: 'lintu', english: 'bird', cefr: 'A2' },
];

const mockData2 = [
  { id: '1', finnish: 'koira', english: 'dog', cefr: 'B1' },
  { id: '2', finnish: 'kissa', english: 'cat', cefr: 'A1' },
  { id: '5', finnish: 'test', english: 'test' }, // No cefr
];

describe('useApiVocabulary CEFR Sorting', () => {
  
  beforeEach(() => {
    vi.resetModules();
    // Reset fetch before each test
    global.fetch = vi.fn(); 
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sorts words by CEFR level in ascending order', async () => {
    // 1. Mock fetch to return mockData1
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData1,
    } as Response);

    // 2. Import the hook dynamically
    const { useApiVocabulary } = await import('./useApiVocabulary');
    
    const { result } = renderHook(() => useApiVocabulary());

    // 3. Wait for data to load
    await waitFor(() => {
      expect(result.current.words.length).toBeGreaterThan(0);
    });

    const { words } = result.current;

    // A1 -> A2 -> B1 -> C1
    expect(words[0].cefr).toBe('A1');
    expect(words[1].cefr).toBe('A2');
    expect(words[2].cefr).toBe('B1');
    expect(words[3].cefr).toBe('C1');
  });

  it('places words without CEFR at the end', async () => {
    // 1. Mock fetch to return mockData2
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData2,
    } as Response);

    const { useApiVocabulary } = await import('./useApiVocabulary');

    const { result } = renderHook(() => useApiVocabulary());

    await waitFor(() => {
      expect(result.current.words.length).toBeGreaterThan(0);
    });

    const { words } = result.current;

    // The last word should be the one with undefined CEFR
    expect(words[words.length - 1].english).toBe('test');
    expect(words[words.length - 1].cefr).toBeUndefined();
  });
});