// ==============================================
// AI Example Generator CLI Interface
// Easy command-line interface for managing AI generation
// ==============================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Finnish Vocabulary AI Example Generator\n');

const commands = {
  start: 'Start AI example generation process',
  resume: 'Resume from where you left off',
  testrun: 'Generate examples for first 100 words (test mode)',
  status: 'Check generation progress',
  config: 'Show current AI configuration',
  test: 'Test AI service with a small batch',
  reset: 'Reset progress (start over)',
  quota: 'Check daily quota usage estimate',
  help: 'Show this help menu'
};

function showHelp() {
  console.log('Available commands:\n');
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(8)} - ${desc}`);
  });
  console.log('\nUsage: node ai-cli.js <command>');
  console.log('Example: node ai-cli.js start\n');
}

function showConfig() {
  try {
    const { aiConfig } = require('./ai-config');
    console.log('🔧 Current AI Configuration:\n');
    console.log(`Service: ${aiConfig.service}`);
    console.log(`Batch size: ${aiConfig.batch.size} words`);
    console.log(`Delay between batches: ${aiConfig.batch.delayMs}ms`);
    console.log(`Max retries: ${aiConfig.batch.maxRetries}`);
    
    if (aiConfig.service !== 'mock') {
      console.log('\n⚠️  Make sure you have configured your API keys in .env file');
    }
  } catch (error) {
    console.error('❌ Error loading configuration:', error.message);
  }
}

function showStatus() {
  const progressPath = path.join(__dirname, 'ai-generation-progress.json');
  const vocabPath = path.join(__dirname, '../public/finnish-vocab-cleaned.json');
  
  try {
    if (!fs.existsSync(progressPath)) {
      console.log('📊 No generation in progress');
      
      if (fs.existsSync(vocabPath)) {
        const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
        const withExamples = vocab.filter(word => word.example && word.aiGenerated).length;
        console.log(`Total vocabulary: ${vocab.length} words`);
        console.log(`AI-generated examples: ${withExamples} words`);
        
        if (withExamples === vocab.length) {
          console.log('✅ All examples already generated!');
        } else {
          console.log(`📝 ${vocab.length - withExamples} words still need examples`);
        }
      }
      return;
    }
    
    const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    const percentage = Math.round((progress.processedCount / progress.totalCount) * 100);
    
    console.log('📊 Generation Progress:');
    console.log(`Processed: ${progress.processedCount}/${progress.totalCount} words (${percentage}%)`);
    console.log(`Last batch: ${progress.lastBatch + 1}`);
    console.log(`Status: In progress`);
    
  } catch (error) {
    console.error('❌ Error reading status:', error.message);
  }
}

function resetProgress() {
  const progressPath = path.join(__dirname, 'ai-generation-progress.json');
  
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath);
    console.log('🔄 Progress reset. You can start fresh now.');
  } else {
    console.log('📝 No progress to reset.');
  }
}

function showQuota() {
  console.log('📊 Daily Quota Estimation:\n');
  
  const { aiConfig } = require('./ai-config');
  const vocabPath = path.join(__dirname, '../public/finnish-vocab-cleaned.json');
  
  if (fs.existsSync(vocabPath)) {
    const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    const totalWords = vocab.length;
    const batchSize = aiConfig.batch.size;
    const totalRequests = Math.ceil(totalWords / batchSize);
    const delaySeconds = aiConfig.batch.delayMs / 1000;
    const estimatedMinutes = Math.ceil((totalRequests * delaySeconds) / 60);
    
    console.log(`Total vocabulary: ${totalWords} words`);
    console.log(`Batch size: ${batchSize} words per request`);
    console.log(`Total requests needed: ${totalRequests}`);
    console.log(`Daily limit: 1,500 requests`);
    console.log(`Estimated time: ~${estimatedMinutes} minutes`);
    
    if (totalRequests > 1500) {
      console.log('⚠️  Warning: This exceeds daily quota!');
    } else {
      console.log(`✅ Within daily quota (${Math.round(totalRequests/1500*100)}% usage)`);
    }
  } else {
    console.log('❌ Vocabulary file not found');
  }
}

async function testAI() {
  console.log('🧪 Testing AI service with a small batch...\n');
  
  try {
    const { getAIService } = require('./ai-config');
    const aiService = getAIService();
    
    const testPrompt = `You are a Finnish language expert. Generate natural example sentences for these words:

1. kissa (cat) - noun
2. juosta (to run) - verb
3. kaunis (beautiful) - adjective

Respond with exactly 3 lines, each containing only the Finnish example sentence:`;

    const response = await aiService(testPrompt);
    const examples = response.trim().split('\n');
    
    console.log('✅ AI Service Test Results:');
    examples.forEach((example, i) => {
      console.log(`${i + 1}. ${example}`);
    });
    
    console.log('\n🎉 AI service is working correctly!');
    
  } catch (error) {
    console.error('❌ AI service test failed:', error.message);
    console.log('\n💡 Check your API configuration and network connection.');
  }
}

function runGenerator(isTestRun = false) {
  return new Promise((resolve, reject) => {
    const args = ['ai-example-generator.js'];
    if (isTestRun) {
      args.push('--test');
    }
    
    const child = spawn('node', args, {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Generator exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function main() {
  const command = process.argv[2];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'config':
      showConfig();
      break;
      
    case 'status':
      showStatus();
      break;
      
    case 'quota':
      showQuota();
      break;
      
    case 'reset':
      resetProgress();
      break;
      
    case 'test':
      await testAI();
      break;
      
    case 'testrun':
      console.log('🧪 Starting test run with first 25 words...\n');
      try {
        await runGenerator(true);
        console.log('\n🎉 Test run completed successfully!');
      } catch (error) {
        console.error('\n❌ Test run failed:', error.message);
      }
      break;
      
    case 'start':
    case 'resume':
      console.log(`🚀 ${command === 'start' ? 'Starting' : 'Resuming'} AI example generation...\n`);
      try {
        await runGenerator();
        console.log('\n🎉 Generation completed successfully!');
      } catch (error) {
        console.error('\n❌ Generation failed:', error.message);
      }
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { showStatus, resetProgress };