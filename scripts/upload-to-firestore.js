import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since this is a Node.js script, we need to use Firebase Admin SDK
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOCABULARY_FILE = path.join(__dirname, '../public/finnish-vocab-ai-enhanced.json');

// Initialize Firebase Admin (for server-side operations)
// Note: You'll need to get your service account key from Firebase Console
const firebaseConfig = {
  projectId: "finnish-vocabulary-1eb04", // Your project ID from .env
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.log('Firebase app already initialized');
}

const db = getFirestore();

// Collections
const COLLECTIONS = {
  VOCABULARY: 'vocabulary',
  CATEGORIES: 'categories'
};

async function uploadVocabularyToFirestore() {
  console.log('🔥 Firebase Firestore Vocabulary Uploader');
  console.log('==========================================');
  
  try {
    // Read vocabulary file
    console.log('📖 Reading vocabulary file...');
    const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));
    console.log(`📚 Found ${vocabularyData.length} vocabulary words`);
    
    // Log sample data structure for verification
    console.log('📋 Sample word structure:');
    console.log(JSON.stringify(vocabularyData[0], null, 2));
    
    // Generate categories from vocabulary data
    console.log('🏷️ Generating categories and mapping difficulties...');
    const categoryMap = new Map();
    let difficultyMappingCount = { beginner: 0, intermediate: 0, advanced: 0 };
    
    vocabularyData.forEach(word => {
      // Map CEFR levels to difficulty (same logic as useApiVocabulary)
      const mapCEFRToDifficulty = (cefr) => {
        if (['A1', 'A2'].includes(cefr)) return 'beginner';
        if (['B1', 'B2'].includes(cefr)) return 'intermediate';
        if (['C1', 'C2'].includes(cefr)) return 'advanced';
        return 'beginner'; // default
      };
      
      // Map difficultyScore to difficulty if CEFR is not available
      const mapScoreToDifficulty = (score) => {
        if (score <= 40) return 'beginner';
        if (score <= 70) return 'intermediate';
        return 'advanced';
      };
      
      // Ensure word has difficulty field (compute from CEFR or difficultyScore)
      if (!word.difficulty) {
        if (word.cefr) {
          word.difficulty = mapCEFRToDifficulty(word.cefr);
        } else if (word.difficultyScore !== undefined) {
          word.difficulty = mapScoreToDifficulty(word.difficultyScore);
        } else {
          word.difficulty = 'beginner'; // fallback
        }
      }
      
      // Count difficulty mapping for logging
      difficultyMappingCount[word.difficulty]++;
      
      // Ensure word has categoryId (use first category or 'general')
      if (!word.categoryId) {
        word.categoryId = (word.categories && word.categories.length > 0) 
          ? word.categories[0] 
          : 'general';
      }
      
      // Ensure examples is an array (some words have empty arrays)
      if (!word.examples || !Array.isArray(word.examples)) {
        word.examples = [];
      }

      // Sanitize examples: flatten to strings, remove nested arrays/objects
      word.examples = word.examples.map(ex => {
        if (typeof ex === 'string') return ex;
        if (ex && typeof ex === 'object') {
          // Prefer .text if present, else JSON.stringify
          if (typeof ex.text === 'string') return ex.text;
          return JSON.stringify(ex);
        }
        return '';
      }).filter(Boolean);

      // Add single example to examples array if not already there
      if (word.example && !word.examples.includes(word.example)) {
        word.examples.push(word.example);
      }

      // Ensure pronunciation has proper format
      if (word.pronunciation && !word.pronunciation.startsWith('/')) {
        word.pronunciation = `/${word.pronunciation}/`;
      }
      
      // Add categories from the categories array
      if (word.categories && Array.isArray(word.categories)) {
        word.categories.forEach(categoryId => {
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              id: categoryId,
              name: categoryId,
              count: 0,
              emoji: getCategoryEmoji(categoryId),
              description: `Words related to ${categoryId}`
            });
          }
          categoryMap.get(categoryId).count++;
        });
      }
      
      // Also add from categoryId if present
      if (word.categoryId && !categoryMap.has(word.categoryId)) {
        categoryMap.set(word.categoryId, {
          id: word.categoryId,
          name: word.categoryId,
          count: 1,
          emoji: getCategoryEmoji(word.categoryId),
          description: `Words related to ${word.categoryId}`
        });
      }
    });
    
    const categories = Array.from(categoryMap.values());
    console.log(`🏷️ Generated ${categories.length} categories`);
    console.log(`📊 Difficulty distribution:`, difficultyMappingCount);
    console.log(`📋 Categories found:`, categories.map(c => `${c.emoji} ${c.name} (${c.count})`).slice(0, 10));
    
    // Upload vocabulary in batches (Firestore limit: 500 operations per batch)
    console.log('📤 Uploading vocabulary to Firestore...');
    const batchSize = 500;
    let uploadedCount = 0;
    
    for (let i = 0; i < vocabularyData.length; i += batchSize) {
      const batch = db.batch();
      const batchWords = vocabularyData.slice(i, i + batchSize);
      
      batchWords.forEach(word => {
        const docRef = db.collection(COLLECTIONS.VOCABULARY).doc(word.id || `word_${i}_${Date.now()}`);
        batch.set(docRef, {
          ...word,
          uploadedAt: new Date().toISOString()
        });
      });
      
      await batch.commit();
      uploadedCount += batchWords.length;
      console.log(`✅ Uploaded batch: ${uploadedCount}/${vocabularyData.length} words`);
    }
    
    // Upload categories
    console.log('📤 Uploading categories to Firestore...');
    const categoryBatch = db.batch();
    
    categories.forEach(category => {
      const docRef = db.collection(COLLECTIONS.CATEGORIES).doc(category.id);
      categoryBatch.set(docRef, {
        ...category,
        uploadedAt: new Date().toISOString()
      });
    });
    
    await categoryBatch.commit();
    console.log(`✅ Uploaded ${categories.length} categories`);
    
    // Create metadata document
    const metadataRef = db.collection('metadata').doc('vocabulary');
    await metadataRef.set({
      totalWords: vocabularyData.length,
      totalCategories: categories.length,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      source: 'finnish-vocab-ai-enhanced.json'
    });
    
    console.log('\n🎉 Upload Complete!');
    console.log('==================');
    console.log(`✅ Uploaded ${vocabularyData.length} vocabulary words`);
    console.log(`✅ Uploaded ${categories.length} categories`);
    console.log(`📊 Created metadata document`);
    console.log(`🔗 Firebase Project: finnish-vocabulary-1eb04`);
    console.log('\n🚀 Your app can now fetch data from Firestore!');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Setup Required:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.log('2. Select your project: finnish-vocabulary-1eb04');
      console.log('3. Go to Firestore Database');
      console.log('4. Create database in production mode');
      console.log('5. Update security rules to allow read/write');
    }
    
    process.exit(1);
  }
}

function getCategoryEmoji(categoryId) {
  const emojiMap = {
    // Grammar categories
    'noun': '📝',
    'verb': '⚡',
    'adjective': '🎨',
    'adverb': '💫',
    'pronoun': '👤',
    'proper_noun': '🏛️',
    'preposition': '🔗',
    'interjection': '❗',
    
    // Semantic categories
    'Family & People': '👨‍👩‍👧‍👦',
    'Time & Numbers': '⏰',
    'Basic Actions': '🏃‍♂️',
    'Nature & Weather': '🌿',
    'Colors & Appearance': '🎨',
    'Body': '🧑‍⚕️',
    'Food & Drink': '🍽️',
    'Animals': '🐾',
    'Work & Education': '📚',
    'Transportation': '🚗',
    'Emotions & Mental States': '😊',
    'Home & Living': '🏠',
    
    // Legacy categories
    'greetings': '👋',
    'numbers': '🔢',
    'food': '🍽️',
    'colors': '🌈',
    'family': '👨‍👩‍👧‍👦',
    'weather': '☀️',
    'body': '🧑‍⚕️',
    'animals': '🐾',
    'clothing': '👕',
    'transportation': '🚗',
    'time': '⏰',
    'home': '🏠',
    'work': '💼',
    'emotions': '😊',
    'actions': '⚡',
    'adjectives': '📝',
    'general': '📖'
  };
  
  return emojiMap[categoryId] || '📚';
}

// Run the upload
console.log('🚀 Starting Firestore upload...');
uploadVocabularyToFirestore();