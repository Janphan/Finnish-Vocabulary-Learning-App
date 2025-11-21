// ==============================================
// Finnish Vocabulary Extractor (Full Dataset ~15k)
// Combines CEFR + multi-category tagging system
// ==============================================

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const inputPath = path.join(__dirname, '../public/kaikki.org-dictionary-Finnish.jsonl');
const outputPath = path.join(__dirname, '../public/finnish-vocab-full.json');
const MAX_WORDS = 5000; // Increase to get more diverse categories

console.log('🔍 Extracting Finnish vocabulary (full dataset) ...\n');

const vocabulary = [];
const processed = new Set();
let totalProcessed = 0;

// ---------- Utility Functions ----------
function normalizePOS(pos) {
    if (!pos) return null;
    pos = pos.toLowerCase();
    if (pos.startsWith('noun')) return 'noun';
    if (pos.startsWith('verb')) return 'verb';
    if (pos.startsWith('adj')) return 'adjective';
    if (pos.startsWith('adverb')) return 'adverb';
    if (pos.startsWith('pronoun')) return 'pronoun';
    if (pos.startsWith('proper')) return 'proper_noun';
    if (pos.startsWith('interj')) return 'interjection';
    if (pos.startsWith('prep')) return 'preposition';
    if (pos.startsWith('conj')) return 'conjunction';
    return pos;
}

function isFinnishWord(entry) {
    const word = entry.word?.toLowerCase();
    if (!word || processed.has(word)) return false;
    if (word.startsWith('-') || word.endsWith('-')) return false;
    if ((word.match(/-/g) || []).length > 1) return false;
    if (word.length < 2 || word.length > 25) return false;

    // Less restrictive letter check - allow more Finnish words
    // Just reject obvious non-Finnish patterns
    if (/[qwx]/.test(word)) return false;

    // POS check - include more parts of speech
    const pos = normalizePOS(entry.pos);
    if (!['noun','verb','adjective','adverb','pronoun','proper_noun','interjection','preposition'].includes(pos)) return false;

    // More lenient etymology check
    const etym = entry.etymology_text?.toLowerCase() || '';
    if (etym.includes('from english') && !etym.includes('old english')) return false;

    // Accept words that look Finnish OR have good categories
    const hasGoodChars = /[äöy]/.test(word);
    const hasDoubleCons = /kk|pp|tt|ll|nn|mm|rr/.test(word);
    const hasCommonEndings = /(nen|inen|lainen|us|ys|os|as|is|aa|uu|ii)$/.test(word);
    const hasAuthenticCategory = entry.categories && entry.categories.some(cat => cat.orig && cat.orig.startsWith('fi:'));
    
    return hasGoodChars || hasDoubleCons || hasCommonEndings || hasAuthenticCategory;
}

function cleanGloss(gloss) {
    if (!gloss) return null;
    let cleaned = gloss
        .replace(/^\([^)]+\)\s*/, '')
        .replace(/\s*\([^)]*\)$/, '')
        .replace(/^(a|an|the)\s+/, '')
        .trim();
    if (cleaned.length === 0 || cleaned.length > 50) return null;
    return cleaned;
}

// CEFR estimation based on word length & complexity
function estimateCEFR(entry, translation) {
    const wordLength = entry.word.length;
    const transLength = translation?.length || 0;
    let level = 'A1';
    if (wordLength > 10 || transLength > 12 || entry.pos === 'verb') level = 'A2';
    if (wordLength > 12 || transLength > 15) level = 'B1';
    if (wordLength > 15 || transLength > 20) level = 'B2';
    if (wordLength > 18 || transLength > 25) level = 'C1';
    return level;
}

// Assign semantic categories based on meaning and patterns
function assignCategories(entry, translation) {
    const categories = [];
    const pos = normalizePOS(entry.pos);
    const word = entry.word.toLowerCase();
    const translationLower = translation?.toLowerCase() || '';
    
    // Primary categorization by part of speech
    if (pos) {
        categories.push(pos);
    }
    
    // Semantic categorization based on meaning patterns
    
    // Family & People
    if (/\b(family|mother|father|parent|child|baby|son|daughter|brother|sister|grandmother|grandfather|uncle|aunt|cousin|relative|person|people|human|man|woman|boy|girl|friend|neighbor)\b/.test(translationLower)) {
        categories.push('Family & People');
    }
    
    // Body parts
    if (/\b(head|eye|nose|mouth|ear|hand|arm|leg|foot|finger|toe|hair|face|body|heart|brain|skin|back|chest|shoulder|knee|neck|stomach)\b/.test(translationLower)) {
        categories.push('Body');
    }
    
    // Animals
    if (/\b(animal|dog|cat|bird|fish|horse|cow|pig|sheep|chicken|mouse|bear|wolf|deer|rabbit|fox|lion|tiger|elephant|monkey|snake)\b/.test(translationLower)) {
        categories.push('Animals');
    }
    
    // Food & Drink
    if (/\b(food|eat|drink|bread|meat|fish|milk|water|coffee|tea|beer|wine|fruit|apple|orange|banana|vegetable|potato|carrot|onion|rice|sugar|salt|restaurant|kitchen|cook|meal|lunch|dinner|breakfast|hungry|thirsty)\b/.test(translationLower)) {
        categories.push('Food & Drink');
    }
    
    // Home & Living
    if (/\b(home|house|room|kitchen|bedroom|bathroom|living|door|window|table|chair|bed|sofa|lamp|television|phone|computer|book|clothes|clothing|dress|shirt|pants|shoes|hat|clean|dirty|furniture|apartment)\b/.test(translationLower)) {
        categories.push('Home & Living');
    }
    
    // Nature & Weather
    if (/\b(nature|tree|flower|plant|forest|mountain|river|lake|sea|ocean|sky|sun|moon|star|weather|rain|snow|wind|cold|hot|warm|cool|spring|summer|autumn|winter|cloud|storm)\b/.test(translationLower)) {
        categories.push('Nature & Weather');
    }
    
    // Transportation & Travel
    if (/\b(car|bus|train|plane|bicycle|boat|ship|road|street|travel|trip|journey|station|airport|hotel|map|ticket|drive|walk|run|go|come|arrive|leave|transport)\b/.test(translationLower)) {
        categories.push('Transportation');
    }
    
    // Time & Numbers
    if (/\b(time|hour|minute|second|day|week|month|year|morning|afternoon|evening|night|today|yesterday|tomorrow|now|early|late|clock|watch|calendar|number|one|two|three|four|five|first|second|last)\b/.test(translationLower) || /^\d+$/.test(word)) {
        categories.push('Time & Numbers');
    }
    
    // Colors & Appearance
    if (/\b(color|colour|red|blue|green|yellow|black|white|brown|orange|purple|pink|gray|grey|dark|light|bright|beautiful|ugly|big|small|long|short|tall|thin|fat|old|young|new)\b/.test(translationLower)) {
        categories.push('Colors & Appearance');
    }
    
    // Work & Education
    if (/\b(work|job|office|school|teacher|student|learn|study|read|write|book|paper|pen|pencil|computer|internet|email|money|buy|sell|shop|store|business|company|doctor|nurse|police|fire)\b/.test(translationLower)) {
        categories.push('Work & Education');
    }
    
    // Emotions & States
    if (/\b(happy|sad|angry|love|hate|like|enjoy|want|need|think|know|understand|remember|forget|hope|fear|worry|tired|sick|healthy|good|bad|better|worse|best|worst|easy|difficult|hard)\b/.test(translationLower)) {
        categories.push('Emotions & Mental States');
    }
    
    // Common actions (verbs get this if they're basic actions)
    if (pos === 'verb' && /\b(be|have|do|make|get|go|come|see|look|hear|listen|say|tell|speak|talk|ask|answer|give|take|put|open|close|start|stop|help|use)\b/.test(translationLower)) {
        categories.push('Basic Actions');
    }
    
    // Common Finnish word patterns (add Finnish-specific categories)
    
    // Weather-specific Finnish words
    if (/^(sää|lumi|sade|tuuli|kylmä|kuuma|lämmin|viileä|pilvi|myrsky)/.test(word)) {
        categories.push('Nature & Weather');
    }
    
    // Finnish family terms
    if (/^(äiti|isä|veli|sisko|mummo|vaari|tyttö|poika|mies|nainen|ihminen)/.test(word)) {
        categories.push('Family & People');
    }
    
    // If no semantic categories found, just keep POS
    if (categories.length === 1 && categories[0] === pos) {
        // Word has only POS category, that's fine
    }
    
    return [...new Set(categories)]; // Remove duplicates
}

// Extract translation
function extractTranslation(entry) {
    if (!entry.senses || entry.senses.length === 0) return null;
    const first = entry.senses[0];
    if (first.glosses && first.glosses.length > 0) {
        return cleanGloss(first.glosses[0]);
    }
    if (first.raw_glosses && first.raw_glosses.length > 0) {
        return cleanGloss(first.raw_glosses[0]);
    }
    return null;
}

// ---------- File processing ----------
const fileStream = fs.createReadStream(inputPath, { encoding: 'utf8' });
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
    totalProcessed++;
    
    // Stop if we have enough words
    if (vocabulary.length >= MAX_WORDS) {
        rl.close();
        return;
    }
    
    try {
        const entry = JSON.parse(line);
        if (!isFinnishWord(entry)) return;

        const translation = extractTranslation(entry);
        if (!translation) return;

        const ipa = entry.sounds?.find(s => s.ipa)?.ipa || null;
        const audio = entry.sounds?.find(s => s.audio)?.audio || null;
        const pos = normalizePOS(entry.pos);
        const categories = assignCategories(entry, translation);
        const cefr = estimateCEFR(entry, translation);

        const vocabWord = {
            id: `vocab-${vocabulary.length + 1}`,
            finnish: entry.word,
            english: translation,
            partOfSpeech: pos,
            categories: categories,
            cefr: cefr,
            pronunciation: ipa,
            audio: audio,
            examples: entry.senses[0]?.examples || [],
            difficultyScore: 75,
            frequency: 50
        };

        vocabulary.push(vocabWord);
        processed.add(entry.word.toLowerCase());

        if (vocabulary.length <= 50 || vocabulary.length % 500 === 0) {
            const categoryStr = categories.join(', ');
            console.log(`✅ Added: ${entry.word} → ${translation} (${pos}, CEFR: ${cefr}) [${categoryStr}]`);
        }

    } catch(e) {
        // skip invalid lines
    }

    if (totalProcessed % 50000 === 0) {
        console.log(`📊 Processed ${totalProcessed} entries, collected ${vocabulary.length} vocabulary...`);
    }
});

rl.on('close', () => {
    console.log('\n🎯 EXTRACTION COMPLETE!\n');
    
    // Filter out categories with fewer than 10 words
    console.log('📊 Filtering categories with fewer than 10 words...\n');
    
    // Count words per category
    const categoryCount = {};
    vocabulary.forEach(word => {
        word.categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
    });
    
    // Find categories with 10+ words
    const validCategories = new Set();
    Object.entries(categoryCount).forEach(([cat, count]) => {
        if (count >= 10) {
            validCategories.add(cat);
        }
    });
    
    // Filter vocabulary to only include words that have at least one valid category
    const filteredVocabulary = vocabulary.filter(word => {
        // Filter categories for this word
        word.categories = word.categories.filter(cat => validCategories.has(cat));
        // Keep word if it has at least one valid category
        return word.categories.length > 0;
    });
    
    console.log(`📈 CATEGORY FILTERING RESULTS:`);
    console.log(`  Categories before filtering: ${Object.keys(categoryCount).length}`);
    console.log(`  Categories after filtering: ${validCategories.size}`);
    console.log(`  Words before filtering: ${vocabulary.length}`);
    console.log(`  Words after filtering: ${filteredVocabulary.length}\n`);
    
    // Show valid categories with counts
    console.log('✅ VALID CATEGORIES (10+ words):');
    Object.entries(categoryCount)
        .filter(([cat, count]) => count >= 10)
        .sort(([,a], [,b]) => b - a)
        .forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} words`);
        });
    
    fs.writeFileSync(outputPath, JSON.stringify(filteredVocabulary, null, 2));
    console.log(`\n📂 Saved ${filteredVocabulary.length} vocabulary words to: ${outputPath}`);
});
