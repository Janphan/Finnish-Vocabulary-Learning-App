## 6th June 2026
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
