// Seed script for Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, writeBatch, doc } = require('firebase/firestore');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Check if environment variables are loaded
console.log('🔧 Firebase Config Check:');
console.log('API Key:', process.env.VITE_FIREBASE_API_KEY ? '✅ Found' : '❌ Missing');
console.log('Project ID:', process.env.VITE_FIREBASE_PROJECT_ID || '❌ Missing');
console.log('Environment variables loaded from .env file');
console.log('');

// Check if any config values are undefined
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars);
  console.error('Make sure your .env file has all VITE_FIREBASE_* variables');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enhanced vocabulary data for seeding Firebase
const SEED_VOCABULARY_DATA = [
  // Greetings & Politeness
  { english: 'hello', finnish: 'hei', pronunciation: 'hey', partOfSpeech: 'interjection', examples: ['Hei, kuinka voit?', 'Hei kaikki!'], categories: ['greetings'], difficulty: 'beginner', frequency: 100 },
  { english: 'goodbye', finnish: 'näkemiin', pronunciation: 'nah-ke-meen', partOfSpeech: 'interjection', examples: ['Näkemiin huomenna!', 'Näkemiin ja kiitos!'], categories: ['greetings'], difficulty: 'beginner', frequency: 95 },
  { english: 'thank you', finnish: 'kiitos', pronunciation: 'kee-tos', partOfSpeech: 'interjection', examples: ['Kiitos paljon!', 'Kiitos avustasi!'], categories: ['greetings'], difficulty: 'beginner', frequency: 98 },
  { english: 'please', finnish: 'ole hyvä', pronunciation: 'o-leh hü-vah', partOfSpeech: 'phrase', examples: ['Ole hyvä ja odota', 'Tule tänne, ole hyvä'], categories: ['greetings'], difficulty: 'beginner', frequency: 90 },
  { english: 'excuse me', finnish: 'anteeksi', pronunciation: 'an-teek-si', partOfSpeech: 'interjection', examples: ['Anteeksi, olen myöhässä', 'Anteeksi häiriöstä'], categories: ['greetings'], difficulty: 'beginner', frequency: 85 },

  // Family
  { english: 'mother', finnish: 'äiti', pronunciation: 'ah-i-ti', partOfSpeech: 'noun', examples: ['Äitini on lääkäri', 'Äiti tekee ruokaa'], categories: ['family'], difficulty: 'beginner', frequency: 96 },
  { english: 'father', finnish: 'isä', pronunciation: 'i-sah', partOfSpeech: 'noun', examples: ['Isäni työskentelee toimistossa', 'Isä lukee sanomalehteä'], categories: ['family'], difficulty: 'beginner', frequency: 95 },
  { english: 'sister', finnish: 'sisko', pronunciation: 'sis-ko', partOfSpeech: 'noun', examples: ['Siskoni on opiskelija', 'Sisko asuu Helsingissä'], categories: ['family'], difficulty: 'beginner', frequency: 88 },
  { english: 'brother', finnish: 'veli', pronunciation: 'veh-li', partOfSpeech: 'noun', examples: ['Veljeni pelaa jalkapalloa', 'Veli on nuorempi kuin minä'], categories: ['family'], difficulty: 'beginner', frequency: 87 },
  { english: 'child', finnish: 'lapsi', pronunciation: 'lap-si', partOfSpeech: 'noun', examples: ['Lapsi leikkii pihalla', 'Lapsella on syntymäpäivät'], categories: ['family'], difficulty: 'beginner', frequency: 92 },

  // Animals
  { english: 'cat', finnish: 'kissa', pronunciation: 'kis-sa', partOfSpeech: 'noun', examples: ['Kissa nukkuu sohvalla', 'Kissalla on pitkä häntä'], categories: ['animals'], difficulty: 'beginner', frequency: 90 },
  { english: 'dog', finnish: 'koira', pronunciation: 'koy-ra', partOfSpeech: 'noun', examples: ['Koira haukkuu kovaa', 'Koiralla on leikkikalu'], categories: ['animals'], difficulty: 'beginner', frequency: 88 },
  { english: 'bird', finnish: 'lintu', pronunciation: 'lin-tu', partOfSpeech: 'noun', examples: ['Lintu laulaa puussa', 'Lintu lentää korkealla'], categories: ['animals'], difficulty: 'beginner', frequency: 85 },
  { english: 'fish', finnish: 'kala', pronunciation: 'ka-la', partOfSpeech: 'noun', examples: ['Kala ui vedessä', 'Syömme kalaa illalliseksi'], categories: ['animals'], difficulty: 'beginner', frequency: 82 },
  { english: 'horse', finnish: 'hevonen', pronunciation: 'he-vo-nen', partOfSpeech: 'noun', examples: ['Hevonen syö heiniä', 'Hevonen galoppaa kentällä'], categories: ['animals'], difficulty: 'intermediate', frequency: 75 },

  // Food & Drinks
  { english: 'bread', finnish: 'leipä', pronunciation: 'lay-pah', partOfSpeech: 'noun', examples: ['Syön leipää aamiaiseksi', 'Leipä on tuoretta'], categories: ['food'], difficulty: 'beginner', frequency: 92 },
  { english: 'milk', finnish: 'maito', pronunciation: 'my-to', partOfSpeech: 'noun', examples: ['Juon maitoa päivittäin', 'Maito on kylmää'], categories: ['food'], difficulty: 'beginner', frequency: 89 },
  { english: 'coffee', finnish: 'kahvi', pronunciation: 'kah-vi', partOfSpeech: 'noun', examples: ['Kahvi on kuumaa', 'Juon kahvia aamulla'], categories: ['food'], difficulty: 'beginner', frequency: 94 },
  { english: 'water', finnish: 'vesi', pronunciation: 'veh-si', partOfSpeech: 'noun', examples: ['Vesi on kirkasta', 'Tarvitsen lasillisen vettä'], categories: ['food'], difficulty: 'beginner', frequency: 96 },
  { english: 'apple', finnish: 'omena', pronunciation: 'o-me-na', partOfSpeech: 'noun', examples: ['Omena on makeaa', 'Syön omenan välipalaksi'], categories: ['food'], difficulty: 'beginner', frequency: 83 },

  // Colors
  { english: 'red', finnish: 'punainen', pronunciation: 'pu-nai-nen', partOfSpeech: 'adjective', examples: ['Ruusu on punainen', 'Punainen auto ajaa tiellä'], categories: ['colors'], difficulty: 'beginner', frequency: 85 },
  { english: 'blue', finnish: 'sininen', pronunciation: 'si-ni-nen', partOfSpeech: 'adjective', examples: ['Taivas on sininen', 'Sininen meri on kaunis'], categories: ['colors'], difficulty: 'beginner', frequency: 83 },
  { english: 'green', finnish: 'vihreä', pronunciation: 'vih-re-ah', partOfSpeech: 'adjective', examples: ['Ruoho on vihreää', 'Vihreä puu kasvaa'], categories: ['colors'], difficulty: 'beginner', frequency: 81 },
  { english: 'yellow', finnish: 'keltainen', pronunciation: 'kel-tai-nen', partOfSpeech: 'adjective', examples: ['Aurinko on keltainen', 'Keltainen kukka kukkii'], categories: ['colors'], difficulty: 'beginner', frequency: 79 },
  { english: 'white', finnish: 'valkoinen', pronunciation: 'val-koi-nen', partOfSpeech: 'adjective', examples: ['Lumi on valkoista', 'Valkoinen paita on puhdas'], categories: ['colors'], difficulty: 'beginner', frequency: 77 },

  // Home & House
  { english: 'house', finnish: 'talo', pronunciation: 'ta-lo', partOfSpeech: 'noun', examples: ['Asumme suuressa talossa', 'Talo on kaunis'], categories: ['home'], difficulty: 'beginner', frequency: 88 },
  { english: 'room', finnish: 'huone', pronunciation: 'hoo-ne', partOfSpeech: 'noun', examples: ['Huone on valoisa', 'Nukun omassa huoneessani'], categories: ['home'], difficulty: 'beginner', frequency: 84 },
  { english: 'kitchen', finnish: 'keittiö', pronunciation: 'kayt-ti-o', partOfSpeech: 'noun', examples: ['Keittiö on iso', 'Valmistan ruokaa keittiössä'], categories: ['home'], difficulty: 'intermediate', frequency: 80 },
  { english: 'door', finnish: 'ovi', pronunciation: 'o-vi', partOfSpeech: 'noun', examples: ['Ovi on kiinni', 'Avaa ovi, ole hyvä'], categories: ['home'], difficulty: 'beginner', frequency: 86 },
  { english: 'window', finnish: 'ikkuna', pronunciation: 'ik-ku-na', partOfSpeech: 'noun', examples: ['Ikkuna on auki', 'Katson ikkunasta ulos'], categories: ['home'], difficulty: 'intermediate', frequency: 78 }
];

// Categories data for seeding
const SEED_CATEGORIES_DATA = [
  { id: 'greetings', name: 'Greetings', count: 5, emoji: '👋', description: 'Common greetings and polite expressions' },
  { id: 'family', name: 'Family', count: 5, emoji: '👨‍👩‍👧‍👦', description: 'Family members and relationships' },
  { id: 'animals', name: 'Animals', count: 5, emoji: '🐕', description: 'Common animals and pets' },
  { id: 'food', name: 'Food & Drinks', count: 5, emoji: '🍽️', description: 'Food, drinks and meals' },
  { id: 'colors', name: 'Colors', count: 5, emoji: '🎨', description: 'Basic colors and shades' },
  { id: 'home', name: 'Home', count: 5, emoji: '🏠', description: 'House, rooms and furniture' }
];

async function seedFirebaseData() {
  console.log('🌱 Starting Firebase data seeding...');

  try {
    // Upload vocabulary words in batches
    console.log('📚 Uploading vocabulary words...');
    const batch = writeBatch(db);
    
    SEED_VOCABULARY_DATA.forEach((word, index) => {
      const docRef = doc(collection(db, 'vocabulary'));
      batch.set(docRef, {
        ...word,
        id: docRef.id,
        categoryId: word.categories[0], // Use first category as main categoryId
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();

    // Upload categories
    console.log('📂 Uploading categories...');
    const categoryBatch = writeBatch(db);
    
    SEED_CATEGORIES_DATA.forEach(category => {
      const docRef = doc(collection(db, 'categories'), category.id);
      categoryBatch.set(docRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await categoryBatch.commit();

    console.log('✅ Firebase seeding completed successfully!');
    console.log(`📊 Uploaded ${SEED_VOCABULARY_DATA.length} vocabulary words`);
    console.log(`📊 Uploaded ${SEED_CATEGORIES_DATA.length} categories`);

  } catch (error) {
    console.error('❌ Error seeding Firebase data:', error);
    if (error.code === 'permission-denied') {
      console.log('💡 Make sure your Firestore security rules allow write access.');
      console.log('💡 For testing, you can use: allow read, write: if true;');
    }
    throw error;
  }
}

// Run the seeding
seedFirebaseData().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});