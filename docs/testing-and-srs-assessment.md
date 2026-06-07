## Random Vocabulary Cards

## Review Session
In the current review session, Spaced Repetition System (SRS) - SM-2 Algorithm is applied with some of word filtering logic.
1. Selection logic

- getSessionWords and getDueWords in charged of word selection: Maximum 20 words each review session.
- Due Words: System takes new words - which has not been reviewed (nexReviewDate < today)
- Priority System: Difficult word (with the difficulty point) <=2 store in localStorage and extend with New word stacked up to 20 words.

2. Flashcard Review
After the user flips the card to review, they can evaluate the card from hard, good or easy level for later review session purpose.
At first, the implementation is based on Honor System, which can be explained as that the user will self-assess and recall the meaning of the word by themselves in their heads. After that, the user can grade the word by swiping left (Forgot) or right (Known). This implementation is followed some of the well-known modern language application as Duolingo, Memrise, etc.

Moreover, the user does not need to evaluate the difficulty level anymore - which may slow down the learning speed. Now they just swipe left (Forgot) or right (Known). The conversion calculation is explained in the later part.

3. SM-2 Algorithm
After being evaluated, the grade will be calculated by calculateReview function in srsLogic.
- Swipe left (Forget): Grade 1. The algorithm reset the repetition and the word will be reviewed by the following day.
- Swipe right (Known): Grade 4. The algorithm will increase the repetition and the interval. 
Also, the easinessFactor will be calculated (HOW?)

