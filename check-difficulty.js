// Check difficulty levels in vocabulary data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

async function checkDifficultyLevels() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  console.log('🎯 Checking difficulty levels in vocabulary...\n');
  
  const snapshot = await getDocs(collection(db, 'vocabulary'));
  const words = snapshot.docs.map(doc => doc.data());
  
  console.log(`Total words: ${words.length}\n`);
  
  // Count by difficulty level
  const difficultyCount = {};
  words.forEach(word => {
    const difficulty = word.difficulty || 'unknown';
    difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
  });
  
  console.log('📊 Words by difficulty level:');
  Object.entries(difficultyCount).forEach(([level, count]) => {
    const percentage = ((count / words.length) * 100).toFixed(1);
    console.log(`- ${level}: ${count} words (${percentage}%)`);
  });
  
  console.log('\n📝 Sample words by difficulty:');
  
  ['beginner', 'intermediate', 'advanced'].forEach(level => {
    const levelWords = words.filter(w => w.difficulty === level).slice(0, 5);
    if (levelWords.length > 0) {
      console.log(`\n${level.toUpperCase()}:`);
      levelWords.forEach(w => {
        console.log(`  - ${w.english} → ${w.finnish} (${w.categories?.[0] || 'no category'})`);
      });
    }
  });
}

checkDifficultyLevels().catch(console.error);