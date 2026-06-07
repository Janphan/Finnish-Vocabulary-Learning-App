// @vitest-environment happy-dom
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { VocabularySwiper } from './VocabularySwiper';

// Mock child components that use Firebase to prevent test environment crashes
vi.mock('./EditWordModal', () => ({
  EditWordModal: () => <div data-testid="edit-modal">Mock Edit Modal</div>
}));

vi.mock('./AddToFolderModal', () => ({
  AddToFolderModal: () => <div data-testid="folder-modal">Mock Folder Modal</div>
}));

const mockWords = [
  { id: '1', finnish: 'yksi', english: 'one', partOfSpeech: 'noun', pronunciation: 'yksi', categories: [], exampleSentence: 'Yksi kissa.' },
  { id: '2', finnish: 'kaksi', english: 'two', partOfSpeech: 'noun', pronunciation: 'kaksi', categories: [], exampleSentence: 'Kaksi koiraa.' },
  { id: '3', finnish: 'kolme', english: 'three', partOfSpeech: 'noun', pronunciation: 'kolme', categories: [], exampleSentence: 'Kolme lintua.' },
  { id: '4', finnish: 'neljä', english: 'four', partOfSpeech: 'noun', pronunciation: 'neljä', categories: [], exampleSentence: 'Neljä autoa.' },
  { id: '5', finnish: 'viisi', english: 'five', partOfSpeech: 'noun', pronunciation: 'viisi', categories: [], exampleSentence: 'Viisi taloa.' },
];

const defaultProps = {
  words: mockWords as any, // Cast to any to bypass strict TypeScript checks for missing fields
  favorites: new Set<string>(),
  folders: [],
  onToggleFavorite: vi.fn(),
  onAddToFolder: vi.fn(),
  onBack: vi.fn(),
  currentUser: null,
};

describe('VocabularySwiper - Randomness feature', () => {
  afterEach(() => {
    // Clean up DOM and reset mocks after each test
    cleanup();
    vi.restoreAllMocks();
  });
// randomnes tests
  it('should call Math.random to shuffle cards on mount', () => {
    // Use spyOn to track if Math.random is triggered
    const randomSpy = vi.spyOn(Math, 'random');
    
    render(<VocabularySwiper {...defaultProps} />);

    // Math.random will be called multiple times during array sorting
    expect(randomSpy).toHaveBeenCalled();
  });

  it('should display a random first card after multiple initializations', () => {
    const startingWords = new Set<string>();

    // Repeat rendering the component 20 times
    // Since there are 5 words, the probability of 1 word being first 20 times consecutively is (1/5)^20 (almost 0)
    // This proves the randomness algorithm works correctly
    for (let i = 0; i < 20; i++) {
      const { container } = render(<VocabularySwiper {...defaultProps} />);
      
      // Find the element containing the Finnish word.
      // Based on the 'text-3xl' class used in VocabularySwiper
      const wordElement = container.querySelector('.text-3xl');
      
      if (wordElement && wordElement.textContent) {
        startingWords.add(wordElement.textContent);
      }
      
      // Unmount the component so the next loop renders from scratch
      cleanup();
    }

    // If the randomness works, we will definitely collect more than 1 word 
    // appearing in the first position across the 20 renders.
    expect(startingWords.size).toBeGreaterThan(1);
  });
  //Edge cases tests
  it('should handle an empty list gracefully', () => {
    const {container} = render(
      <VocabularySwiper
        {...defaultProps}
        words={[]}
      />
    );
    const wordElement = container.querySelector('.text-3xl');
    expect(wordElement).toBeNull();
});

  it('should return the same word if only one word is provided', () => {
    const singleWord = [{ id: '1', finnish: 'yksi', english: 'one', partOfSpeech: 'noun', pronunciation: 'yksi', categories: [] }];
    const { container } = render(
      <VocabularySwiper
        {...defaultProps}
        words={singleWord as any}
      />
    );
    const wordElement = container.querySelector('.text-3xl');
    expect(wordElement?.textContent).toBe('yksi');
  });
  it('should only display words that exist in the provided list', () => {   
    const {container} = render(
      <VocabularySwiper
        {...defaultProps} />
    );
    const wordElement = container.querySelector('.text-3xl');
    const validFinnishWords = mockWords.map(w => w.finnish);   
    expect(validFinnishWords).toContain(wordElement?.textContent);     
})
});
//edge cases
//empty list: should render nothing or a message
//1 word in the list
//word created should be in the list, not from random list
