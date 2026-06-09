## 7th June 2026
# Fix: Review Session incorrectly repeats words on the same day & deck resuffling

# Fix: Function shuffle using Math.random() - 0.5
Replace by using Fisher-Yates for better mix and lessen biased

```
const shuffle = <T>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };
```

Normal traditional random function was like: ```arr.sort(() => Math.random() - 0.5)```
This is not uniformly distributed. 
Fisher-Yates Shuffle method ensures Unbiased Shuffle.

# Behaviour after finishing one review session
In the current status, there is no screen or route after the user finishes a review session.
Implement to have congratulation screen + Option route for user to review again.
May add time usage for a session for statistic purpose.

Learning: Rules of Hooks
Facing "Rendered fewer hooks than expected" error while implementing this screen.
1. Only call Hooks (useState, useEffect, useContext) in the top level.
Not in loop, if switch, nested function or after an early return.

2. Only call Hooks from React Functions: In React Function Components or Custom Hooks

# Fix: ReviewSession.tsx - Keyboard event handling for flipping and grading

Allow user to flip a card repeatedly before deciding to swipe

**Learning:** Functional Update

```
if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); // Prevent scrolling
        setIsFlipped((prev) => !prev);
        return;
      }

      if (!isFlipped) return; // Allow grading only when the answer is revealed

```

setIsFlipped((prev) => !prev); -> change the status of the current card. For example, if the card is opened then close.

## 8th June 2026

# Review Again feature after finishing Review Session
  - Reset `currentIndex` to 0
  - Reset `isFlipped` to false
  - Reset `complete` to false

## 9th June 2026

# Check the SM-2 Algorithm
Since the method to evaluate the vocabulary has changed to "Forgot/Known", the algorithm to evaluate EF and word interval need to be updated.

# Function allWords gets too many reads in Firebase
Root cause: 
The app fetches all ~4300 vocabulary words from Firestore on every load, causing a massive amount of reads per user session even though the dictionary rarely changes.
+ Auto reset cache when refreshing (e.g., when the user clicks "Refresh" in the app).

Solution:
Enabled Firestore Local Cache (`persistentLocalCache`) in the Firebase configuration. 
- First load: ~4300 reads to store the dictionary offline.
- Subsequent loads: 0 reads for the dictionary. Firestore pulls directly from IndexedDB, dropping the database cost drastically.
- Filtering ~4300 array items locally via `getSessionWords` takes < 5ms, meaning UI performance remains extremely fast without needing complex server-side pagination.

