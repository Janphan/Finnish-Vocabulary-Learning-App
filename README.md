# Finnish Vocabulary Learning App

A simple React app for learning Finnish vocabulary with a clean API-based architecture.

## Project Structure

```
Finnish-Vocabulary-Learning-App/
├── api-server/               # Express API server
│   ├── server.js            # Main server file
│   ├── package.json         # Server dependencies
│   └── node_modules/        # Server dependencies
├── src/
│   ├── App.tsx              # Main React app
│   ├── main.tsx             # React entry point
│   ├── components/          # React components
│   │   ├── CategoryList.tsx
│   │   ├── VocabularySwiper.tsx
│   │   ├── FolderManager.tsx
│   │   ├── AddToFolderModal.tsx
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   └── hooks/
│       └── useApiVocabulary.ts  # API hook
├── public/
│   └── polished-vocabulary.json  # 1,500 curated vocabulary words
├── package.json              # React app dependencies
└── README.md                 # This file
```

## Features

- **1,500 High-Quality Words**: Curated Finnish vocabulary with translations
- **14 Categories**: Organized by topics (greetings, food, animals, etc.)
- **Difficulty Levels**: Beginner, intermediate, and advanced words
- **Interactive Learning**: Swipe-based vocabulary practice
- **Personal Folders**: Save words to custom collections
- **Clean API**: RESTful endpoints for vocabulary data

## Quick Start

### 1. Start the API Server

```bash
cd api-server
npm install
npm start
```

Server runs on http://localhost:3002

### 2. Start the React App

```bash
npm install
npm run dev
```

App runs on http://localhost:5173

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/vocabulary` - Get all vocabulary (with filters)
- `GET /api/categories` - Get all categories
- `GET /api/vocabulary/random/:category` - Get random words from category
- `GET /api/stats` - Get vocabulary statistics

### Example API Calls

```bash
# Get all vocabulary
curl http://localhost:3002/api/vocabulary

# Get words from 'food' category
curl http://localhost:3002/api/vocabulary?category=food

# Get beginner level words
curl http://localhost:3002/api/vocabulary?difficulty=beginner

# Get 10 random animal words
curl http://localhost:3002/api/vocabulary/random/animals?count=10

# Get statistics
curl http://localhost:3002/api/stats
```

## Vocabulary Quality

The vocabulary dataset has been intelligently filtered from 170k+ words to 1,500 high-quality entries:

- **Quality Score**: 100/100 average
- **Clean Translations**: Removed technical jargon and parenthetical explanations
- **Balanced Categories**: Even distribution across topics
- **Frequency-Based**: Most commonly used words prioritized
- **Difficulty Graded**: Appropriate for language learners

## Development

- **Framework**: React 18 + TypeScript + Vite
- **Backend**: Express.js with CORS
- **Data**: Static JSON file (no database required)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Testing with Postman

You can test the API endpoints using Postman:

1. Import the following requests:

   - GET `http://localhost:3002/api/health`
   - GET `http://localhost:3002/api/vocabulary`
   - GET `http://localhost:3002/api/categories`
   - GET `http://localhost:3002/api/stats`

2. Add query parameters as needed:
   - `category`: Filter by category ID
   - `difficulty`: Filter by difficulty level
   - `limit`: Number of words to return
   - `search`: Search Finnish or English text

## Data Source

The vocabulary data comes from Wiktextract (kaikki.org) and has been processed through:

1. **Extraction**: 3.86GB raw data → 45MB clean JSONL
2. **Filtering**: 170k+ entries → 1,500 top-quality words
3. **Enhancement**: Added pronunciations, examples, categories, difficulty levels
4. **Optimization**: Cleaned translations and balanced distribution

Perfect for local development and testing without external dependencies!
