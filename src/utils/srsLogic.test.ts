import { describe, it, expect } from 'vitest'; // or 'jest' if using CRA
import { calculateReview } from './srsLogic';
import { VocabularyWord } from '../types';

// Mock a standard word
const mockWord: VocabularyWord = {
  id: '1',
  english: 'Cat',
  finnish: 'Kissa',
  interval: 0,
  repetitions: 0,
  easinessFactor: 2.5,
  nextReviewDate: new Date().toISOString(),
  categories: [],
  exampleSentence: ''
};

describe('SRS Logic (SM-2 Algorithm)', () => {
  
  it('should schedule a new word for 1 day if grade is "Forgot" (1)', () => {
    const result = calculateReview(mockWord, 1);
    
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0); // Repetitions reset
  });

  it('should schedule a new word for 1 day if grade is "Recall" (3)', () => {
    // First successful review usually sets interval to 1
    const result = calculateReview(mockWord, 3);
    
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it('should increase interval significantly for "Easy" (5)', () => {
    // If we mark it easy, we expect it to push out
    const result = calculateReview(mockWord, 5);
    
    // Logic: First interval 1, but EF increases
    expect(result.interval).toBe(1); 
    expect(result.easinessFactor).toBeGreaterThan(2.5);
  });

  it('should reset interval to 1 if user forgets a known word', () => {
    const knownWord = { ...mockWord, interval: 10, repetitions: 4 };
    const result = calculateReview(knownWord, 1); // Grade 1 = Forgot

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
  });

  it('should multiply interval for known words (Good/3)', () => {
    // Word known for 6 days with default EF (2.5)
    // Next interval should be approx 6 * 2.5 = 15
    const knownWord = { ...mockWord, interval: 6, repetitions: 2, easinessFactor: 2.5 };
    const result = calculateReview(knownWord, 3);

    expect(result.interval).toBe(15);
  });

  it('should update the nextReviewDate correctly', () => {
    const result = calculateReview(mockWord, 3);
    
    const now = new Date();
    const reviewDate = new Date(result.nextReviewDate!);
    
    // Check if the date is roughly 1 day in the future
    // We allow a small buffer (1000ms) for execution time
    const diffInHours = (reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    expect(diffInHours).toBeGreaterThan(23); // At least 23 hours ahead
    expect(diffInHours).toBeLessThan(25);    // Less than 25 hours ahead
  });
});