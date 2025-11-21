// ==============================================
// Finnish Vocabulary Translation Cleaner
// Remove entries with grammatical descriptions instead of real translations
// ==============================================

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/finnish-vocab-full.json');
const outputPath = path.join(__dirname, '../public/finnish-vocab-cleaned.json');

console.log('🧹 Cleaning vocabulary translations...\n');

// Load the vocabulary data
const vocabularyData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Function to check if a translation is problematic
function hasProblematicTranslation(english) {
    const englishLower = english.toLowerCase();
    
    // Patterns that indicate grammatical descriptions rather than translations
    const problematicPatterns = [
        'imperative of',
        'singular of',
        'plural of',
        'form of',
        'genitive',
        'partitive',
        'alternative form',
        'alternative spelling',
        'nominative',
        'inflection of',
        'comparative of',
        'superlative of',
        'initialism of',
        'abbreviation of',
        'past tense of',
        'past participle of',
        'present of',
        'infinitive of',
        'first-person',
        'second-person',
        'third-person',
        'elative',
        'illative',
        'adessive',
        'ablative',
        'allative'
    ];
    
    return problematicPatterns.some(pattern => englishLower.includes(pattern));
}

// Function to check if entry is worth keeping for vocabulary learning
function isValidVocabularyEntry(word) {
    // Skip if translation is problematic
    if (hasProblematicTranslation(word.english)) {
        return false;
    }
    
    // Skip very short or very long translations (likely not useful)
    if (word.english.length < 2 || word.english.length > 50) {
        return false;
    }
    
    // Skip if translation is just punctuation or numbers
    if (/^[^\w\s]+$/.test(word.english) || /^\d+$/.test(word.english)) {
        return false;
    }
    
    // Skip if translation contains too many parentheses (often grammatical notes)
    if ((word.english.match(/\(/g) || []).length > 1) {
        return false;
    }
    
    return true;
}

// Filter the vocabulary
const originalCount = vocabularyData.length;
const cleanedVocabulary = vocabularyData.filter(isValidVocabularyEntry);
const removedCount = originalCount - cleanedVocabulary.length;

// Recalculate category counts after filtering
const categoryCount = {};
cleanedVocabulary.forEach(word => {
    if (word.categories && Array.isArray(word.categories)) {
        word.categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
    }
});

// Filter out categories that now have fewer than 10 words
const validCategories = new Set();
Object.entries(categoryCount).forEach(([cat, count]) => {
    if (count >= 10) {
        validCategories.add(cat);
    }
});

// Update vocabulary to only include words with valid categories
const finalVocabulary = cleanedVocabulary.filter(word => {
    // Filter categories for this word
    if (word.categories && Array.isArray(word.categories)) {
        word.categories = word.categories.filter(cat => validCategories.has(cat));
        // Keep word if it has at least one valid category
        return word.categories.length > 0;
    }
    return false;
}).map((word, index) => ({
    ...word,
    id: `vocab-${index + 1}` // Reassign IDs to be sequential
}));

console.log(`📊 CLEANING RESULTS:`);
console.log(`  Original vocabulary: ${originalCount} words`);
console.log(`  After translation cleaning: ${cleanedVocabulary.length} words`);
console.log(`  After category filtering: ${finalVocabulary.length} words`);
console.log(`  Removed: ${originalCount - finalVocabulary.length} words (${((originalCount - finalVocabulary.length)/originalCount*100).toFixed(1)}%)`);

// Show some examples of what was removed
const removedEntries = vocabularyData.filter(word => !isValidVocabularyEntry(word)).slice(0, 10);
console.log('\n🗑️  EXAMPLES OF REMOVED ENTRIES:');
removedEntries.forEach((word, i) => {
    console.log(`  ${i+1}. ${word.finnish} → ${word.english}`);
});

// Show final category distribution
const finalCategoryCount = {};
finalVocabulary.forEach(word => {
    word.categories.forEach(cat => {
        finalCategoryCount[cat] = (finalCategoryCount[cat] || 0) + 1;
    });
});

console.log('\n✅ FINAL CATEGORY DISTRIBUTION:');
Object.entries(finalCategoryCount)
    .filter(([cat, count]) => count >= 10)
    .sort(([,a], [,b]) => b - a)
    .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} words`);
    });

// Save the cleaned vocabulary
fs.writeFileSync(outputPath, JSON.stringify(finalVocabulary, null, 2));
console.log(`\n📂 Saved cleaned vocabulary to: ${outputPath}`);