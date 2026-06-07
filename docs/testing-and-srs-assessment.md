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

-- 
## Review Session Logic
There are 20 random cards to review each time. A word marked as "Known" will be reviewed after a certain interval. A word marked as "Forgot" will be reviewed the next day. The session ends when all 20 cards are reviewed.

# How random Review Session works?
First, the system will create 20 words according to the logic priority:
- 1. Known + Due words
- 2. Totally New words: If 1. is not enough to fill 20 words.
- 3. Known + Not Due words: If 1. and 2. are not enough to fill 20 words.


Use case 1: User stops in the middle of the session
- Current implementation: Save-as-you-go, when the user stops, the grade of the word will be sent to the server.
Use case 2: User takes many review session in a day
- Current implementation: The system will provide 20 new words for each session.

Use case 3: User wants to review known words
- Current implementation: The system will not provide known words for review, unless the user specifically requests to review them.
Reason to choose: To ensure that the user focuses on learning new or difficult words, and to prevent overwhelming them with already mastered vocabulary.
Trade-offs: Need to review consistently to remember


