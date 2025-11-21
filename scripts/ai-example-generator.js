// ==============================================
// AI-Powered Finnish Example Generator
// Generate contextual examples using AI batch processing
// ==============================================

const fs = require('fs');
const path = require('path');
const { aiConfig, getAIService } = require('./ai-config');

// Check if running in test mode
const isTestMode = process.argv.includes('--test');
const TEST_WORD_LIMIT = 25;

const inputPath = path.join(__dirname, '../public/finnish-vocab-ai-enhanced.json');
const outputPath = isTestMode ? 
  path.join(__dirname, '../public/finnish-vocab-test-100.json') : 
  path.join(__dirname, '../public/finnish-vocab-ai-enhanced.json');
const progressPath = path.join(__dirname, 'ai-generation-progress.json');

// Configuration from ai-config.js
const BATCH_SIZE = aiConfig.batch.size;
const DELAY_BETWEEN_BATCHES = aiConfig.batch.delayMs;
const MAX_RETRIES = aiConfig.batch.maxRetries;

console.log('🤖 AI Example Generator for Finnish Vocabulary\n');

// Load vocabulary data
let vocabularyData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// In test mode, limit to first 20 words
if (isTestMode) {
  vocabularyData = vocabularyData.slice(0, TEST_WORD_LIMIT);
  console.log(`🧪 TEST MODE: Processing first ${TEST_WORD_LIMIT} words only\n`);
}

// Load or initialize progress
let progress = { processedCount: 0, totalCount: vocabularyData.length, lastBatch: 0 };
if (fs.existsSync(progressPath) && !isTestMode) {
  progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  console.log(`📊 Resuming from word ${progress.processedCount}/${progress.totalCount}`);
} else {
  console.log(`📊 Starting fresh: ${progress.totalCount} words to process`);
}

// Create AI prompt for batch processing
function createBatchPrompt(wordBatch) {
  const wordsData = wordBatch.map(word => ({
    finnish: word.finnish,
    english: word.english,
    partOfSpeech: word.partOfSpeech,
    categories: word.categories || []
  }));

  return `You are a native Finnish speaker and language teacher. Create natural, everyday Finnish example sentences that help language learners understand how to use these words correctly.

INSTRUCTIONS:
• Create sentences that sound natural and are commonly used by Finnish speakers
• Use proper Finnish grammar, including correct cases and verb conjugations
• Make sentences 4-10 words long for clarity
• Include context that shows the word's meaning clearly
• Use everyday vocabulary that Finnish learners would encounter

VOCABULARY TO PROCESS:
${wordsData.map((word, i) => 
  `${i + 1}. Finnish word: "${word.finnish}" (English: "${word.english}") - Part of speech: ${word.partOfSpeech}`
).join('\n')}

REQUIRED OUTPUT FORMAT:
Provide exactly ${wordBatch.length} lines. Each line must contain ONLY the Finnish example sentence for the corresponding numbered word above. No explanations, no translations, no numbering - just the pure Finnish sentences.

Examples of good Finnish sentences:
- "Kissa nukkuu sohvalla rauhallisesti."
- "Hän menee töihin joka aamu."
- "Ruoka tuoksuu todella hyvältä."

Your ${wordBatch.length} Finnish example sentences:`;
}

// Mock AI API call (replace with your AI service)
async function callAI(prompt) {
  console.log(`🔄 Calling ${aiConfig.service.toUpperCase()} AI service...`);
  
  const aiService = getAIService();
  return await aiService(prompt);
}

// Process a batch of words with retry logic
async function processBatch(batch, batchIndex) {
  console.log(`\n🔄 Processing batch ${batchIndex + 1} (words ${batchIndex * BATCH_SIZE + 1}-${Math.min((batchIndex + 1) * BATCH_SIZE, vocabularyData.length)})`);
  
  let retryCount = 0;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      const prompt = createBatchPrompt(batch);
      const aiResponse = await callAI(prompt);
      
      // Parse AI response
      const examples = aiResponse.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (examples.length !== batch.length) {
        console.warn(`⚠️  Expected ${batch.length} examples, got ${examples.length}. Using available examples.`);
      }
      
      // Apply examples to words
      batch.forEach((word, index) => {
        if (examples[index] && examples[index].trim().length > 0) {
          word.example = examples[index].trim();
          word.aiGenerated = true;
          word.generatedAt = new Date().toISOString();
          word.aiService = aiConfig.service;
        }
        // If no valid example, leave the word without an example
      });
      
      console.log(`✅ Generated ${Math.min(examples.length, batch.length)} examples successfully`);
      return; // Success, exit retry loop
      
    } catch (error) {
      retryCount++;
      console.error(`❌ Error processing batch ${batchIndex + 1} (attempt ${retryCount}/${MAX_RETRIES + 1}):`, error.message);
      
      if (retryCount <= MAX_RETRIES) {
        console.log(`🔄 Retrying in ${DELAY_BETWEEN_BATCHES/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      } else {
        console.log(`💥 Max retries exceeded for batch ${batchIndex + 1}, skipping examples for this batch`);
        // Don't add examples for words that failed - leave them without examples
        batch.forEach(word => {
          word.aiGenerationFailed = true;
          word.generatedAt = new Date().toISOString();
        });
      }
    }
  }
}

// Save progress
function saveProgress() {
  if (!isTestMode) {
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  }
  fs.writeFileSync(outputPath, JSON.stringify(vocabularyData, null, 2));
}

// Main processing function
async function processAllBatches() {
  const startBatch = Math.floor(progress.processedCount / BATCH_SIZE);
  const totalBatches = Math.ceil(vocabularyData.length / BATCH_SIZE);
  
  console.log(`🎯 Processing ${totalBatches} batches of ${BATCH_SIZE} words each\n`);
  
  for (let batchIndex = startBatch; batchIndex < totalBatches; batchIndex++) {
    const startIdx = batchIndex * BATCH_SIZE;
    const endIdx = Math.min(startIdx + BATCH_SIZE, vocabularyData.length);
    const batch = vocabularyData.slice(startIdx, endIdx);
    
    await processBatch(batch, batchIndex);
    
    // Update progress
    progress.processedCount = endIdx;
    progress.lastBatch = batchIndex;
    saveProgress();
    
    console.log(`📈 Progress: ${progress.processedCount}/${progress.totalCount} (${Math.round(progress.processedCount/progress.totalCount*100)}%)`);
    
    // Delay between batches to respect API limits
    if (batchIndex < totalBatches - 1) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  console.log('\n🎉 All batches processed successfully!');
  console.log(`📁 Enhanced vocabulary saved to: ${outputPath}`);
  
  if (isTestMode) {
    console.log('🧪 Test Results Summary:');
    const wordsWithExamples = vocabularyData.filter(w => w.example).length;
    console.log(`Generated examples for ${wordsWithExamples}/${vocabularyData.length} words`);
    console.log('Test file created: finnish-vocab-test-100.json');
  } else {
    // Cleanup progress file only in normal mode
    if (fs.existsSync(progressPath)) {
      fs.unlinkSync(progressPath);
      console.log('🧹 Progress file cleaned up');
    }
  }
}

// Run the processing
if (require.main === module) {
  processAllBatches().catch(console.error);
}

module.exports = { processBatch, createBatchPrompt };