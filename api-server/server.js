// Simple Express API server for vocabulary data
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Load vocabulary data
let vocabularyData = [];
let categories = [];

function loadVocabularyData() {
  try {
    const dataPath = path.join(__dirname, '../public/polished-vocabulary.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Convert to proper format
    vocabularyData = data.map((item, index) => ({
      id: `vocab-${index}`,
      finnish: item.finnish,
      english: item.english,
      categoryId: item.categoryId || 'general',
      categories: item.categories || [item.categoryId || 'general'],
      pronunciation: item.pronunciation || '',
      example: item.examples?.[0] || `${item.finnish} - ${item.english}`,
      difficulty: item.difficulty || 'beginner',
      frequency: item.frequency || 0,
      partOfSpeech: item.partOfSpeech
    }));

    console.log(`📚 Loaded ${vocabularyData.length} vocabulary words`);
    generateCategories();
  } catch (error) {
    console.error('Failed to load vocabulary data:', error);
    vocabularyData = [];
  }
}

function generateCategories() {
  const categoryCount = {};
  
  vocabularyData.forEach(word => {
    const category = word.categoryId;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const categoryInfo = {
    greetings: { name: 'Greetings', emoji: '👋', description: 'Common greetings and polite expressions' },
    family: { name: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Family members and relationships' },
    animals: { name: 'Animals', emoji: '🐕', description: 'Common animals and pets' },
    food: { name: 'Food & Drinks', emoji: '🍽️', description: 'Food, drinks and meals' },
    colors: { name: 'Colors', emoji: '🎨', description: 'Basic colors and shades' },
    body: { name: 'Body Parts', emoji: '👤', description: 'Parts of the human body' },
    weather: { name: 'Weather', emoji: '🌤️', description: 'Weather conditions and climate' },
    transport: { name: 'Transportation', emoji: '🚗', description: 'Vehicles and transportation' },
    clothing: { name: 'Clothing', emoji: '👕', description: 'Clothes and accessories' },
    home: { name: 'Home', emoji: '🏠', description: 'House, rooms and furniture' },
    actions: { name: 'Actions', emoji: '🏃', description: 'Verbs and action words' },
    descriptions: { name: 'Descriptions', emoji: '📝', description: 'Adjectives and descriptive words' },
    education: { name: 'Education', emoji: '📚', description: 'School, learning and education' },
    general: { name: 'General', emoji: '📚', description: 'General vocabulary and common words' }
  };

  categories = Object.entries(categoryCount).map(([id, count]) => ({
    id,
    name: categoryInfo[id]?.name || id.charAt(0).toUpperCase() + id.slice(1),
    count,
    emoji: categoryInfo[id]?.emoji || '📚',
    description: categoryInfo[id]?.description || `${id} vocabulary`
  })).sort((a, b) => b.count - a.count);
}

// Routes

// GET /api/vocabulary - Get all vocabulary with optional filters
app.get('/api/vocabulary', (req, res) => {
  try {
    const {
      category,
      difficulty,
      limit = 50,
      offset = 0,
      search
    } = req.query;

    let words = [...vocabularyData];

    // Apply filters
    if (category) {
      words = words.filter(word => 
        word.categoryId === category || 
        word.categories.includes(category)
      );
    }

    if (difficulty && difficulty !== 'all') {
      words = words.filter(word => word.difficulty === difficulty);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      words = words.filter(word => 
        word.finnish.toLowerCase().includes(searchLower) ||
        word.english.toLowerCase().includes(searchLower)
      );
    }

    // Sort by frequency (highest first)
    words.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

    const total = words.length;
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    words = words.slice(startIndex, endIndex);

    res.json({
      words,
      total,
      categories,
      pagination: {
        offset: startIndex,
        limit: parseInt(limit),
        hasMore: endIndex < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// GET /api/categories - Get all categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// GET /api/vocabulary/random/:category - Get random words from category
app.get('/api/vocabulary/random/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { count = 20 } = req.query;

    const categoryWords = vocabularyData.filter(word => 
      word.categoryId === category || word.categories.includes(category)
    );

    // Shuffle and take requested count
    const shuffled = [...categoryWords].sort(() => 0.5 - Math.random());
    const randomWords = shuffled.slice(0, parseInt(count));

    res.json(randomWords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random words' });
  }
});

// GET /api/vocabulary/:id - Get specific word
app.get('/api/vocabulary/:id', (req, res) => {
  try {
    const { id } = req.params;
    const word = vocabularyData.find(word => word.id === id);

    if (word) {
      res.json(word);
    } else {
      res.status(404).json({ error: 'Word not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch word' });
  }
});

// GET /api/stats - Get vocabulary statistics
app.get('/api/stats', (req, res) => {
  try {
    const difficultyBreakdown = vocabularyData.reduce((acc, word) => {
      acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalWords: vocabularyData.length,
      categoriesCount: categories.length,
      difficultyBreakdown,
      topCategories: categories.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    vocabularyLoaded: vocabularyData.length > 0,
    wordCount: vocabularyData.length,
    categoriesCount: categories.length
  });
});

// Load data and start server
loadVocabularyData();

app.listen(PORT, () => {
  console.log(`🚀 Vocabulary API server running on http://localhost:${PORT}`);
  console.log(`📖 Serving ${vocabularyData.length} vocabulary words`);
  console.log(`📂 ${categories.length} categories available`);
  console.log(`\n🔗 API Endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/vocabulary`);
  console.log(`   GET http://localhost:${PORT}/api/categories`);
  console.log(`   GET http://localhost:${PORT}/api/stats`);
  console.log(`   GET http://localhost:${PORT}/api/health`);
});