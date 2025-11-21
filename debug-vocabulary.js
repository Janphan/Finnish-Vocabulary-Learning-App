const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXvjkEhWDKJeLXo0VYvx8cPeHmxzpd4AE",
  authDomain: "finnish-vocabulary-app.firebaseapp.com",
  projectId: "finnish-vocabulary-app",
  storageBucket: "finnish-vocabulary-app.firebasestorage.app",
  messagingSenderId: "999071863673",
  appId: "1:999071863673:web:99cc64e9dd51ce16d6cd79",
  measurementId: "G-W89MJRCHFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkVocabularyData() {
  try {
    console.log('🔍 Checking vocabulary data structure...');
    
    // Get first 10 documents
    const q = query(collection(db, 'vocabulary'), limit(10));
    const snapshot = await getDocs(q);
    
    console.log(`📊 Found ${snapshot.docs.length} documents`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n${index + 1}. Document ${doc.id}:`);
      console.log(`   Finnish: ${data.finnish}`);
      console.log(`   English: ${data.english}`);
      console.log(`   Difficulty: ${data.difficulty || 'MISSING'}`);
      console.log(`   Categories: ${JSON.stringify(data.categories || 'MISSING')}`);
      console.log(`   CategoryId: ${data.categoryId || 'MISSING'}`);
    });
    
    // Count documents by difficulty
    const allDocs = await getDocs(collection(db, 'vocabulary'));
    const difficultyCounts = { beginner: 0, intermediate: 0, advanced: 0, missing: 0 };
    
    allDocs.docs.forEach(doc => {
      const difficulty = doc.data().difficulty;
      if (difficulty === 'beginner') difficultyCounts.beginner++;
      else if (difficulty === 'intermediate') difficultyCounts.intermediate++;
      else if (difficulty === 'advanced') difficultyCounts.advanced++;
      else difficultyCounts.missing++;
    });
    
    console.log('\n📈 Difficulty Distribution:');
    console.log(`   Total documents: ${allDocs.docs.length}`);
    console.log(`   Beginner: ${difficultyCounts.beginner}`);
    console.log(`   Intermediate: ${difficultyCounts.intermediate}`);
    console.log(`   Advanced: ${difficultyCounts.advanced}`);
    console.log(`   Missing difficulty: ${difficultyCounts.missing}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkVocabularyData();