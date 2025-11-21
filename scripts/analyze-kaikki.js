// Analyze the original kaikki.org Finnish dictionary data
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const inputPath = path.join(__dirname, '../public/kaikki.org-dictionary-Finnish.jsonl');

console.log('🔍 Analyzing kaikki.org Finnish dictionary data...\n');

// Statistics to track
const stats = {
  totalEntries: 0,
  byPos: {},
  bySenses: {},
  withTranslations: 0,
  withSounds: 0,
  withExamples: 0,
  uniqueWords: new Set(),
  categories: new Set(),
  translationLanguages: new Set(),
  sampleEntries: []
};

// Process the JSONL file line by line
const fileStream = createReadStream(inputPath, { encoding: 'utf8' });
const rl = createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineCount = 0;
const maxSamples = 20;

rl.on('line', (line) => {
  try {
    const entry = JSON.parse(line);
    stats.totalEntries++;
    lineCount++;

    // Collect sample entries for analysis
    if (stats.sampleEntries.length < maxSamples) {
      stats.sampleEntries.push({
        word: entry.word,
        pos: entry.pos,
        lang: entry.lang,
        senses: entry.senses ? entry.senses.length : 0,
        translations: entry.translations ? entry.translations.length : 0,
        sounds: entry.sounds ? entry.sounds.length : 0,
        examples: entry.examples ? entry.examples.length : 0
      });
    }

    // Track unique words
    if (entry.word) {
      stats.uniqueWords.add(entry.word.toLowerCase());
    }

    // Track parts of speech
    if (entry.pos) {
      stats.byPos[entry.pos] = (stats.byPos[entry.pos] || 0) + 1;
    }

    // Track number of senses (definitions)
    const senseCount = entry.senses ? entry.senses.length : 0;
    const senseKey = senseCount === 0 ? 'no_senses' : 
                     senseCount === 1 ? '1_sense' :
                     senseCount <= 3 ? '2-3_senses' :
                     senseCount <= 5 ? '4-5_senses' : '6+_senses';
    stats.bySenses[senseKey] = (stats.bySenses[senseKey] || 0) + 1;

    // Check for translations
    if (entry.translations && entry.translations.length > 0) {
      stats.withTranslations++;
      
      // Track translation languages
      entry.translations.forEach(trans => {
        if (trans.lang) {
          stats.translationLanguages.add(trans.lang);
        }
      });
    }

    // Check for pronunciation data
    if (entry.sounds && entry.sounds.length > 0) {
      stats.withSounds++;
    }

    // Check for examples
    if (entry.examples && entry.examples.length > 0) {
      stats.withExamples++;
    }

    // Progress indicator
    if (lineCount % 50000 === 0) {
      console.log(`📊 Processed ${lineCount} entries...`);
    }

  } catch (error) {
    // Skip invalid JSON lines
    console.log(`⚠️ Skipping invalid JSON on line ${lineCount}`);
  }
});

rl.on('close', () => {
  console.log('\n✅ Analysis complete!\n');

  // Report findings
  console.log('📊 KAIKKI.ORG FINNISH DICTIONARY ANALYSIS');
  console.log('=' .repeat(50));
  
  console.log(`\n📈 OVERALL STATISTICS:`);
  console.log(`  Total entries: ${stats.totalEntries.toLocaleString()}`);
  console.log(`  Unique words: ${stats.uniqueWords.size.toLocaleString()}`);
  console.log(`  With translations: ${stats.withTranslations.toLocaleString()} (${(stats.withTranslations/stats.totalEntries*100).toFixed(1)}%)`);
  console.log(`  With pronunciations: ${stats.withSounds.toLocaleString()} (${(stats.withSounds/stats.totalEntries*100).toFixed(1)}%)`);
  console.log(`  With examples: ${stats.withExamples.toLocaleString()} (${(stats.withExamples/stats.totalEntries*100).toFixed(1)}%)`);

  console.log(`\n📝 PARTS OF SPEECH (Top 10):`);
  Object.entries(stats.byPos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([pos, count]) => {
      const percentage = (count/stats.totalEntries*100).toFixed(1);
      console.log(`  ${pos}: ${count.toLocaleString()} (${percentage}%)`);
    });

  console.log(`\n🎯 SENSE DISTRIBUTION:`);
  Object.entries(stats.bySenses)
    .sort(([,a], [,b]) => b - a)
    .forEach(([senses, count]) => {
      const percentage = (count/stats.totalEntries*100).toFixed(1);
      console.log(`  ${senses}: ${count.toLocaleString()} (${percentage}%)`);
    });

  console.log(`\n🌍 TRANSLATION LANGUAGES (Top 15):`);
  Array.from(stats.translationLanguages)
    .slice(0, 15)
    .forEach(lang => console.log(`  ${lang}`));

  console.log(`\n📋 SAMPLE ENTRIES FOR INSPECTION:`);
  stats.sampleEntries.forEach((entry, i) => {
    console.log(`${i+1}. "${entry.word}" (${entry.pos || 'unknown'})`);
    console.log(`   Senses: ${entry.senses}, Translations: ${entry.translations}, Sounds: ${entry.sounds}, Examples: ${entry.examples}`);
  });

  // Recommendations for vocabulary extraction
  console.log(`\n💡 RECOMMENDATIONS FOR VOCABULARY EXTRACTION:`);
  console.log(`✅ Strong candidates:`);
  console.log(`  • Entries with English translations: ${stats.withTranslations.toLocaleString()} words`);
  console.log(`  • Entries with pronunciation: ${stats.withSounds.toLocaleString()} words`);
  console.log(`  • Entries with usage examples: ${stats.withExamples.toLocaleString()} words`);
  
  console.log(`\n🎯 Optimal extraction criteria:`);
  console.log(`  • Target: nouns, verbs, adjectives (highest utility for learners)`);
  console.log(`  • Require: English translations + pronunciation data`);
  console.log(`  • Prefer: entries with 1-3 senses (clearer definitions)`);
  console.log(`  • Bonus: entries with usage examples`);
  
  const estimatedHighQuality = Math.floor(stats.withTranslations * 0.3); // Conservative estimate
  console.log(`\n📊 ESTIMATED HIGH-QUALITY VOCABULARY:`);
  console.log(`  Potential extraction: ~${estimatedHighQuality.toLocaleString()} high-quality words`);
  console.log(`  Recommended target: 500-2000 words for learning app`);
});

rl.on('error', (error) => {
  console.error('❌ Error reading file:', error.message);
});