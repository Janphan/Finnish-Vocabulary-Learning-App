// Seed script for Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, writeBatch, doc, getDocs } = require('firebase/firestore');
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

// Enhanced vocabulary data for seeding Firebase - Expanded Dataset
const SEED_VOCABULARY_DATA = [
  // Greetings & Politeness (10 words)
  { english: 'hello', finnish: 'hei', pronunciation: 'hey', partOfSpeech: 'interjection', examples: ['Hei, kuinka voit?', 'Hei kaikki!'], categories: ['greetings'], difficulty: 'beginner', frequency: 100 },
  { english: 'goodbye', finnish: 'näkemiin', pronunciation: 'nah-ke-meen', partOfSpeech: 'interjection', examples: ['Näkemiin huomenna!', 'Näkemiin ja kiitos!'], categories: ['greetings'], difficulty: 'beginner', frequency: 95 },
  { english: 'thank you', finnish: 'kiitos', pronunciation: 'kee-tos', partOfSpeech: 'interjection', examples: ['Kiitos paljon!', 'Kiitos avustasi!'], categories: ['greetings'], difficulty: 'beginner', frequency: 98 },
  { english: 'please', finnish: 'ole hyvä', pronunciation: 'o-leh hü-vah', partOfSpeech: 'phrase', examples: ['Ole hyvä ja odota', 'Tule tänne, ole hyvä'], categories: ['greetings'], difficulty: 'beginner', frequency: 90 },
  { english: 'excuse me', finnish: 'anteeksi', pronunciation: 'an-teek-si', partOfSpeech: 'interjection', examples: ['Anteeksi, olen myöhässä', 'Anteeksi häiriöstä'], categories: ['greetings'], difficulty: 'beginner', frequency: 85 },
  { english: 'good morning', finnish: 'hyvää huomenta', pronunciation: 'hü-vah hoo-men-ta', partOfSpeech: 'phrase', examples: ['Hyvää huomenta kaikille!', 'Hyvää huomenta, rakas'], categories: ['greetings'], difficulty: 'beginner', frequency: 88 },
  { english: 'good night', finnish: 'hyvää yötä', pronunciation: 'hü-vah yö-tah', partOfSpeech: 'phrase', examples: ['Hyvää yötä ja kauniita unia', 'Hyvää yötä, nähdään huomenna'], categories: ['greetings'], difficulty: 'beginner', frequency: 85 },
  { english: 'welcome', finnish: 'tervetuloa', pronunciation: 'ter-ve-tu-lo-a', partOfSpeech: 'interjection', examples: ['Tervetuloa kotiin!', 'Tervetuloa Suomeen!'], categories: ['greetings'], difficulty: 'intermediate', frequency: 80 },
  { english: 'sorry', finnish: 'pahoitteluni', pronunciation: 'pa-hoy-te-lu-ni', partOfSpeech: 'noun', examples: ['Pahoitteluni viiveestä', 'Pahoitteluni häiriöstä'], categories: ['greetings'], difficulty: 'intermediate', frequency: 75 },
  { english: 'you\'re welcome', finnish: 'ole hyvä', pronunciation: 'o-leh hü-vah', partOfSpeech: 'phrase', examples: ['Kiitos! - Ole hyvä!', 'Ei kestä, ole hyvä'], categories: ['greetings'], difficulty: 'beginner', frequency: 82 },

  // Family (12 words)
  { english: 'mother', finnish: 'äiti', pronunciation: 'ah-i-ti', partOfSpeech: 'noun', examples: ['Äitini on lääkäri', 'Äiti tekee ruokaa'], categories: ['family'], difficulty: 'beginner', frequency: 96 },
  { english: 'father', finnish: 'isä', pronunciation: 'i-sah', partOfSpeech: 'noun', examples: ['Isäni työskentelee toimistossa', 'Isä lukee sanomalehteä'], categories: ['family'], difficulty: 'beginner', frequency: 95 },
  { english: 'sister', finnish: 'sisko', pronunciation: 'sis-ko', partOfSpeech: 'noun', examples: ['Siskoni on opiskelija', 'Sisko asuu Helsingissä'], categories: ['family'], difficulty: 'beginner', frequency: 88 },
  { english: 'brother', finnish: 'veli', pronunciation: 'veh-li', partOfSpeech: 'noun', examples: ['Veljeni pelaa jalkapalloa', 'Veli on nuorempi kuin minä'], categories: ['family'], difficulty: 'beginner', frequency: 87 },
  { english: 'child', finnish: 'lapsi', pronunciation: 'lap-si', partOfSpeech: 'noun', examples: ['Lapsi leikkii pihalla', 'Lapsella on syntymäpäivät'], categories: ['family'], difficulty: 'beginner', frequency: 92 },
  { english: 'grandmother', finnish: 'mummo', pronunciation: 'mum-mo', partOfSpeech: 'noun', examples: ['Mummo leipoo pullaa', 'Mummo kertoo tarinoita'], categories: ['family'], difficulty: 'beginner', frequency: 85 },
  { english: 'grandfather', finnish: 'pappa', pronunciation: 'pap-pa', partOfSpeech: 'noun', examples: ['Pappa opettaa kalastamaan', 'Pappa on viisas mies'], categories: ['family'], difficulty: 'beginner', frequency: 84 },
  { english: 'wife', finnish: 'vaimo', pronunciation: 'vay-mo', partOfSpeech: 'noun', examples: ['Vaimoni on opettaja', 'Vaimo tykkää lukea'], categories: ['family'], difficulty: 'intermediate', frequency: 78 },
  { english: 'husband', finnish: 'mies', pronunciation: 'mee-es', partOfSpeech: 'noun', examples: ['Mieheni tekee töitä', 'Mies rakastaa urheilua'], categories: ['family'], difficulty: 'intermediate', frequency: 80 },
  { english: 'daughter', finnish: 'tytär', pronunciation: 'tü-tar', partOfSpeech: 'noun', examples: ['Tyttäreni on lahjakas', 'Tytär opiskelee yliopistossa'], categories: ['family'], difficulty: 'intermediate', frequency: 76 },
  { english: 'son', finnish: 'poika', pronunciation: 'poy-ka', partOfSpeech: 'noun', examples: ['Poikani pelaa jalkapalloa', 'Poika on ahkera opiskelija'], categories: ['family'], difficulty: 'beginner', frequency: 89 },
  { english: 'baby', finnish: 'vauva', pronunciation: 'vau-va', partOfSpeech: 'noun', examples: ['Vauva nukkuu rauhallisesti', 'Vauva on niin suloinen'], categories: ['family'], difficulty: 'beginner', frequency: 83 },

  // Animals (15 words)
  { english: 'cat', finnish: 'kissa', pronunciation: 'kis-sa', partOfSpeech: 'noun', examples: ['Kissa nukkuu sohvalla', 'Kissalla on pitkä häntä'], categories: ['animals'], difficulty: 'beginner', frequency: 90 },
  { english: 'dog', finnish: 'koira', pronunciation: 'koy-ra', partOfSpeech: 'noun', examples: ['Koira haukkuu kovaa', 'Koiralla on leikkikalu'], categories: ['animals'], difficulty: 'beginner', frequency: 88 },
  { english: 'bird', finnish: 'lintu', pronunciation: 'lin-tu', partOfSpeech: 'noun', examples: ['Lintu laulaa puussa', 'Lintu lentää korkealla'], categories: ['animals'], difficulty: 'beginner', frequency: 85 },
  { english: 'fish', finnish: 'kala', pronunciation: 'ka-la', partOfSpeech: 'noun', examples: ['Kala ui vedessä', 'Syömme kalaa illalliseksi'], categories: ['animals'], difficulty: 'beginner', frequency: 82 },
  { english: 'horse', finnish: 'hevonen', pronunciation: 'he-vo-nen', partOfSpeech: 'noun', examples: ['Hevonen syö heiniä', 'Hevonen galoppaa kentällä'], categories: ['animals'], difficulty: 'intermediate', frequency: 75 },
  { english: 'cow', finnish: 'lehmä', pronunciation: 'leh-mah', partOfSpeech: 'noun', examples: ['Lehmä antaa maitoa', 'Lehmä syö ruohoa'], categories: ['animals'], difficulty: 'beginner', frequency: 78 },
  { english: 'pig', finnish: 'sika', pronunciation: 'si-ka', partOfSpeech: 'noun', examples: ['Sika mörisee', 'Sika rakastaa mutaa'], categories: ['animals'], difficulty: 'beginner', frequency: 72 },
  { english: 'sheep', finnish: 'lammas', pronunciation: 'lam-mas', partOfSpeech: 'noun', examples: ['Lammas tuottaa villaa', 'Lammas syö ruohoa'], categories: ['animals'], difficulty: 'beginner', frequency: 70 },
  { english: 'bear', finnish: 'karhu', pronunciation: 'kar-hu', partOfSpeech: 'noun', examples: ['Karhu nukkuu talviunta', 'Karhu on vahva eläin'], categories: ['animals'], difficulty: 'intermediate', frequency: 68 },
  { english: 'wolf', finnish: 'susi', pronunciation: 'su-si', partOfSpeech: 'noun', examples: ['Susi ulvoo kuulle', 'Susi elää metsässä'], categories: ['animals'], difficulty: 'intermediate', frequency: 65 },
  { english: 'rabbit', finnish: 'kani', pronunciation: 'ka-ni', partOfSpeech: 'noun', examples: ['Kani hyppii nopeasti', 'Kani syö porkkanoita'], categories: ['animals'], difficulty: 'beginner', frequency: 74 },
  { english: 'mouse', finnish: 'hiiri', pronunciation: 'hee-ri', partOfSpeech: 'noun', examples: ['Hiiri juoksee nopeasti', 'Hiiri piilossa kolossa'], categories: ['animals'], difficulty: 'beginner', frequency: 71 },
  { english: 'duck', finnish: 'ankka', pronunciation: 'ank-ka', partOfSpeech: 'noun', examples: ['Ankka ui lammessa', 'Ankka syöttää poikasiaan'], categories: ['animals'], difficulty: 'beginner', frequency: 73 },
  { english: 'chicken', finnish: 'kana', pronunciation: 'ka-na', partOfSpeech: 'noun', examples: ['Kana munii munia', 'Kana kaivelee maata'], categories: ['animals'], difficulty: 'beginner', frequency: 76 },
  { english: 'elk', finnish: 'hirvi', pronunciation: 'hir-vi', partOfSpeech: 'noun', examples: ['Hirvi on Suomen suurin eläin', 'Hirvi syö lehtiä'], categories: ['animals'], difficulty: 'intermediate', frequency: 66 },

  // Food & Drinks (18 words)
  { english: 'bread', finnish: 'leipä', pronunciation: 'lay-pah', partOfSpeech: 'noun', examples: ['Syön leipää aamiaiseksi', 'Leipä on tuoretta'], categories: ['food'], difficulty: 'beginner', frequency: 92 },
  { english: 'milk', finnish: 'maito', pronunciation: 'my-to', partOfSpeech: 'noun', examples: ['Juon maitoa päivittäin', 'Maito on kylmää'], categories: ['food'], difficulty: 'beginner', frequency: 89 },
  { english: 'coffee', finnish: 'kahvi', pronunciation: 'kah-vi', partOfSpeech: 'noun', examples: ['Kahvi on kuumaa', 'Juon kahvia aamulla'], categories: ['food'], difficulty: 'beginner', frequency: 94 },
  { english: 'water', finnish: 'vesi', pronunciation: 'veh-si', partOfSpeech: 'noun', examples: ['Vesi on kirkasta', 'Tarvitsen lasillisen vettä'], categories: ['food'], difficulty: 'beginner', frequency: 96 },
  { english: 'apple', finnish: 'omena', pronunciation: 'o-me-na', partOfSpeech: 'noun', examples: ['Omena on makeaa', 'Syön omenan välipalaksi'], categories: ['food'], difficulty: 'beginner', frequency: 83 },
  { english: 'fish', finnish: 'kala', pronunciation: 'ka-la', partOfSpeech: 'noun', examples: ['Kala on terveellistä', 'Grillaan kalaa'], categories: ['food'], difficulty: 'beginner', frequency: 82 },
  { english: 'meat', finnish: 'liha', pronunciation: 'li-ha', partOfSpeech: 'noun', examples: ['Liha on proteiinia', 'Paistan lihaa pannulla'], categories: ['food'], difficulty: 'beginner', frequency: 85 },
  { english: 'cheese', finnish: 'juusto', pronunciation: 'yoos-to', partOfSpeech: 'noun', examples: ['Juusto on hyvää', 'Laitan juustoa leivän päälle'], categories: ['food'], difficulty: 'beginner', frequency: 80 },
  { english: 'egg', finnish: 'muna', pronunciation: 'mu-na', partOfSpeech: 'noun', examples: ['Muna on ravitsevaa', 'Paistan munan aamiaiseksi'], categories: ['food'], difficulty: 'beginner', frequency: 87 },
  { english: 'potato', finnish: 'peruna', pronunciation: 'pe-ru-na', partOfSpeech: 'noun', examples: ['Peruna on suomalaista ruokaa', 'Keitan perunoita'], categories: ['food'], difficulty: 'beginner', frequency: 91 },
  { english: 'rice', finnish: 'riisi', pronunciation: 'ree-si', partOfSpeech: 'noun', examples: ['Riisi on hyvä lisuke', 'Keitan riisiä kiinalaiseen ruokaan'], categories: ['food'], difficulty: 'beginner', frequency: 78 },
  { english: 'soup', finnish: 'keitto', pronunciation: 'kay-to', partOfSpeech: 'noun', examples: ['Keitto lämmittää talvella', 'Äiti tekee hyvää keittoa'], categories: ['food'], difficulty: 'beginner', frequency: 84 },
  { english: 'salad', finnish: 'salaatti', pronunciation: 'sa-laat-ti', partOfSpeech: 'noun', examples: ['Salaatti on terveellistä', 'Syön salaattia lounaalla'], categories: ['food'], difficulty: 'beginner', frequency: 76 },
  { english: 'cake', finnish: 'kakku', pronunciation: 'kak-ku', partOfSpeech: 'noun', examples: ['Kakku on makeaa', 'Leipomme kakkua syntymäpäiviin'], categories: ['food'], difficulty: 'beginner', frequency: 79 },
  { english: 'ice cream', finnish: 'jäätelö', pronunciation: 'yah-te-lö', partOfSpeech: 'noun', examples: ['Jäätelö on kylmää', 'Lapset rakastavat jäätelöä'], categories: ['food'], difficulty: 'beginner', frequency: 81 },
  { english: 'beer', finnish: 'olut', pronunciation: 'o-lut', partOfSpeech: 'noun', examples: ['Olut on suosittua Suomessa', 'Juon oluen saunassa'], categories: ['food'], difficulty: 'beginner', frequency: 77 },
  { english: 'juice', finnish: 'mehu', pronunciation: 'me-hu', partOfSpeech: 'noun', examples: ['Mehu on makeaa', 'Lapset juovat appelsiinimehua'], categories: ['food'], difficulty: 'beginner', frequency: 82 },
  { english: 'tea', finnish: 'tee', pronunciation: 'teh', partOfSpeech: 'noun', examples: ['Tee rauhoittaa', 'Juon teetä illalla'], categories: ['food'], difficulty: 'beginner', frequency: 86 },

  // Colors (12 words)
  { english: 'red', finnish: 'punainen', pronunciation: 'pu-nai-nen', partOfSpeech: 'adjective', examples: ['Ruusu on punainen', 'Punainen auto ajaa tiellä'], categories: ['colors'], difficulty: 'beginner', frequency: 85 },
  { english: 'blue', finnish: 'sininen', pronunciation: 'si-ni-nen', partOfSpeech: 'adjective', examples: ['Taivas on sininen', 'Sininen meri on kaunis'], categories: ['colors'], difficulty: 'beginner', frequency: 83 },
  { english: 'green', finnish: 'vihreä', pronunciation: 'vih-re-ah', partOfSpeech: 'adjective', examples: ['Ruoho on vihreää', 'Vihreä puu kasvaa'], categories: ['colors'], difficulty: 'beginner', frequency: 81 },
  { english: 'yellow', finnish: 'keltainen', pronunciation: 'kel-tai-nen', partOfSpeech: 'adjective', examples: ['Aurinko on keltainen', 'Keltainen kukka kukkii'], categories: ['colors'], difficulty: 'beginner', frequency: 79 },
  { english: 'white', finnish: 'valkoinen', pronunciation: 'val-koi-nen', partOfSpeech: 'adjective', examples: ['Lumi on valkoista', 'Valkoinen paita on puhdas'], categories: ['colors'], difficulty: 'beginner', frequency: 77 },
  { english: 'black', finnish: 'musta', pronunciation: 'mus-ta', partOfSpeech: 'adjective', examples: ['Yö on mustaa', 'Musta kissa nukkuu'], categories: ['colors'], difficulty: 'beginner', frequency: 84 },
  { english: 'brown', finnish: 'ruskea', pronunciation: 'rus-ke-a', partOfSpeech: 'adjective', examples: ['Puu on ruskeaa', 'Ruskea koira juoksee'], categories: ['colors'], difficulty: 'beginner', frequency: 75 },
  { english: 'pink', finnish: 'vaaleanpunainen', pronunciation: 'vah-le-an-pu-nai-nen', partOfSpeech: 'adjective', examples: ['Vaaleanpunainen kukka on kaunis', 'Vaaleanpunainen mekko'], categories: ['colors'], difficulty: 'intermediate', frequency: 68 },
  { english: 'purple', finnish: 'violetti', pronunciation: 'vi-o-let-ti', partOfSpeech: 'adjective', examples: ['Violetti kukkiva puu', 'Violetti väri on kaunis'], categories: ['colors'], difficulty: 'intermediate', frequency: 65 },
  { english: 'orange', finnish: 'oranssi', pronunciation: 'o-rans-si', partOfSpeech: 'adjective', examples: ['Oranssi appelsiini', 'Oranssi auringonlasku'], categories: ['colors'], difficulty: 'beginner', frequency: 72 },
  { english: 'gray', finnish: 'harmaa', pronunciation: 'har-maa', partOfSpeech: 'adjective', examples: ['Harmaa pilvi', 'Harmaa kivi maassa'], categories: ['colors'], difficulty: 'beginner', frequency: 74 },
  { english: 'gold', finnish: 'kultainen', pronunciation: 'kul-tai-nen', partOfSpeech: 'adjective', examples: ['Kultainen sormus', 'Kultainen auringonvalo'], categories: ['colors'], difficulty: 'intermediate', frequency: 63 },

  // Body Parts (15 words)
  { english: 'head', finnish: 'pää', pronunciation: 'pah', partOfSpeech: 'noun', examples: ['Pää on kehon ylin osa', 'Pään sisällä on aivot'], categories: ['body'], difficulty: 'beginner', frequency: 88 },
  { english: 'eye', finnish: 'silmä', pronunciation: 'sil-mah', partOfSpeech: 'noun', examples: ['Silmä näkee kauniita asioita', 'Silmät ovat siniset'], categories: ['body'], difficulty: 'beginner', frequency: 90 },
  { english: 'nose', finnish: 'nenä', pronunciation: 'ne-nah', partOfSpeech: 'noun', examples: ['Nenä haisee tuoksuja', 'Nenä on kasvojen keskellä'], categories: ['body'], difficulty: 'beginner', frequency: 85 },
  { english: 'mouth', finnish: 'suu', pronunciation: 'soo', partOfSpeech: 'noun', examples: ['Suu puhuu sanoja', 'Suu syö ruokaa'], categories: ['body'], difficulty: 'beginner', frequency: 89 },
  { english: 'ear', finnish: 'korva', pronunciation: 'kor-va', partOfSpeech: 'noun', examples: ['Korva kuulee ääniä', 'Korva sattuu'], categories: ['body'], difficulty: 'beginner', frequency: 86 },
  { english: 'hand', finnish: 'käsi', pronunciation: 'kah-si', partOfSpeech: 'noun', examples: ['Käsi tarttuu esineisiin', 'Käsi on viiden sormen päässä'], categories: ['body'], difficulty: 'beginner', frequency: 92 },
  { english: 'foot', finnish: 'jalka', pronunciation: 'yal-ka', partOfSpeech: 'noun', examples: ['Jalka kävelee maassa', 'Jalka on kehon alaosa'], categories: ['body'], difficulty: 'beginner', frequency: 87 },
  { english: 'arm', finnish: 'käsivarsi', pronunciation: 'kah-si-var-si', partOfSpeech: 'noun', examples: ['Käsivarsi nostaa tavaraa', 'Käsivarsi on vahva'], categories: ['body'], difficulty: 'beginner', frequency: 83 },
  { english: 'leg', finnish: 'jalka', pronunciation: 'yal-ka', partOfSpeech: 'noun', examples: ['Jalka juoksee nopeasti', 'Jalka kantaa kehon painoa'], categories: ['body'], difficulty: 'beginner', frequency: 84 },
  { english: 'finger', finnish: 'sormi', pronunciation: 'sor-mi', partOfSpeech: 'noun', examples: ['Sormi osoittaa suuntaa', 'Sormi koskettelee esineitä'], categories: ['body'], difficulty: 'beginner', frequency: 81 },
  { english: 'hair', finnish: 'hiukset', pronunciation: 'hee-uk-set', partOfSpeech: 'noun', examples: ['Hiukset ovat päässä', 'Hiukset ovat pitkät'], categories: ['body'], difficulty: 'beginner', frequency: 85 },
  { english: 'tooth', finnish: 'hammas', pronunciation: 'ham-mas', partOfSpeech: 'noun', examples: ['Hammas pureksii ruokaa', 'Hammas on valkoinen'], categories: ['body'], difficulty: 'beginner', frequency: 80 },
  { english: 'heart', finnish: 'sydän', pronunciation: 'sü-dan', partOfSpeech: 'noun', examples: ['Sydän lyö rinnassa', 'Sydän pumppaa verta'], categories: ['body'], difficulty: 'intermediate', frequency: 78 },
  { english: 'stomach', finnish: 'vatsa', pronunciation: 'vat-sa', partOfSpeech: 'noun', examples: ['Vatsa sulattaa ruokaa', 'Vatsa on nälkäinen'], categories: ['body'], difficulty: 'beginner', frequency: 82 },
  { english: 'back', finnish: 'selkä', pronunciation: 'sel-kah', partOfSpeech: 'noun', examples: ['Selkä tukee kehoa', 'Selkä on suora'], categories: ['body'], difficulty: 'beginner', frequency: 79 },

  // Weather (12 words)
  { english: 'sun', finnish: 'aurinko', pronunciation: 'au-rin-ko', partOfSpeech: 'noun', examples: ['Aurinko paistaa kirkkaasti', 'Aurinko lämmittää maata'], categories: ['weather'], difficulty: 'beginner', frequency: 88 },
  { english: 'rain', finnish: 'sade', pronunciation: 'sa-de', partOfSpeech: 'noun', examples: ['Sade kastaa maan', 'Sade ropistaa katolla'], categories: ['weather'], difficulty: 'beginner', frequency: 85 },
  { english: 'snow', finnish: 'lumi', pronunciation: 'lu-mi', partOfSpeech: 'noun', examples: ['Lumi peittää maan', 'Lumi on valkoista'], categories: ['weather'], difficulty: 'beginner', frequency: 89 },
  { english: 'wind', finnish: 'tuuli', pronunciation: 'too-li', partOfSpeech: 'noun', examples: ['Tuuli puhaltaa voimakkaasti', 'Tuuli liikuttaa lehtiä'], categories: ['weather'], difficulty: 'beginner', frequency: 83 },
  { english: 'cloud', finnish: 'pilvi', pronunciation: 'pil-vi', partOfSpeech: 'noun', examples: ['Pilvi peittää auringon', 'Pilvi on harmaa'], categories: ['weather'], difficulty: 'beginner', frequency: 81 },
  { english: 'storm', finnish: 'myrsky', pronunciation: 'mür-skü', partOfSpeech: 'noun', examples: ['Myrsky on voimakas', 'Myrsky tuo sadetta'], categories: ['weather'], difficulty: 'intermediate', frequency: 72 },
  { english: 'ice', finnish: 'jää', pronunciation: 'yah', partOfSpeech: 'noun', examples: ['Jää on kylmää', 'Jää peittää järven'], categories: ['weather'], difficulty: 'beginner', frequency: 86 },
  { english: 'cold', finnish: 'kylmä', pronunciation: 'kül-mah', partOfSpeech: 'adjective', examples: ['Ilma on kylmää', 'Kylmä tuuli puhaltaa'], categories: ['weather'], difficulty: 'beginner', frequency: 90 },
  { english: 'warm', finnish: 'lämmin', pronunciation: 'lam-min', partOfSpeech: 'adjective', examples: ['Ilma on lämmintä', 'Lämmin kesäpäivä'], categories: ['weather'], difficulty: 'beginner', frequency: 87 },
  { english: 'hot', finnish: 'kuuma', pronunciation: 'koo-ma', partOfSpeech: 'adjective', examples: ['Sauna on kuuma', 'Kuuma kesäpäivä'], categories: ['weather'], difficulty: 'beginner', frequency: 84 },
  { english: 'thunder', finnish: 'ukkonen', pronunciation: 'uk-ko-nen', partOfSpeech: 'noun', examples: ['Ukkonen jyrisee', 'Ukkonen pelottaa lapsia'], categories: ['weather'], difficulty: 'intermediate', frequency: 68 },
  { english: 'fog', finnish: 'sumu', pronunciation: 'su-mu', partOfSpeech: 'noun', examples: ['Sumu peittää maiseman', 'Sumu on tiheää'], categories: ['weather'], difficulty: 'intermediate', frequency: 70 },

  // Transportation (12 words)
  { english: 'car', finnish: 'auto', pronunciation: 'au-to', partOfSpeech: 'noun', examples: ['Auto ajaa tiellä', 'Auto on nopea kulkuväline'], categories: ['transport'], difficulty: 'beginner', frequency: 92 },
  { english: 'bus', finnish: 'bussi', pronunciation: 'bus-si', partOfSpeech: 'noun', examples: ['Bussi kuljettaa matkustajia', 'Bussi pysähtyy pysäkillä'], categories: ['transport'], difficulty: 'beginner', frequency: 85 },
  { english: 'train', finnish: 'juna', pronunciation: 'yu-na', partOfSpeech: 'noun', examples: ['Juna kulkee kiskoilla', 'Juna on pitkä'], categories: ['transport'], difficulty: 'beginner', frequency: 83 },
  { english: 'airplane', finnish: 'lentokone', pronunciation: 'len-to-ko-ne', partOfSpeech: 'noun', examples: ['Lentokone lentää korkealla', 'Lentokone vie ulkomaille'], categories: ['transport'], difficulty: 'intermediate', frequency: 78 },
  { english: 'bicycle', finnish: 'polkupyörä', pronunciation: 'pol-ku-pyö-rah', partOfSpeech: 'noun', examples: ['Polkupyörä on ympäristöystävällinen', 'Polkupyörä on terveellistä liikuntaa'], categories: ['transport'], difficulty: 'intermediate', frequency: 80 },
  { english: 'boat', finnish: 'vene', pronunciation: 've-ne', partOfSpeech: 'noun', examples: ['Vene soutaa vedessä', 'Vene kalastaa järvellä'], categories: ['transport'], difficulty: 'beginner', frequency: 76 },
  { english: 'motorcycle', finnish: 'moottoripyörä', pronunciation: 'moot-to-ri-pyö-rah', partOfSpeech: 'noun', examples: ['Moottoripyörä on nopea', 'Moottoripyörä on meluisa'], categories: ['transport'], difficulty: 'advanced', frequency: 65 },
  { english: 'taxi', finnish: 'taksi', pronunciation: 'tak-si', partOfSpeech: 'noun', examples: ['Taksi kuljettaa asiakkaita', 'Taksi on keltainen'], categories: ['transport'], difficulty: 'beginner', frequency: 74 },
  { english: 'ship', finnish: 'laiva', pronunciation: 'lay-va', partOfSpeech: 'noun', examples: ['Laiva purjehtii merellä', 'Laiva kuljettaa tavaroita'], categories: ['transport'], difficulty: 'beginner', frequency: 72 },
  { english: 'tram', finnish: 'raitiovaunu', pronunciation: 'ray-ti-o-vau-nu', partOfSpeech: 'noun', examples: ['Raitiovaunu kulkee Helsingissä', 'Raitiovaunu on hiljainen'], categories: ['transport'], difficulty: 'advanced', frequency: 62 },
  { english: 'truck', finnish: 'kuorma-auto', pronunciation: 'kuor-ma-au-to', partOfSpeech: 'noun', examples: ['Kuorma-auto kuljettaa tavaroita', 'Kuorma-auto on suuri'], categories: ['transport'], difficulty: 'intermediate', frequency: 71 },
  { english: 'helicopter', finnish: 'helikopteri', pronunciation: 'he-li-kop-te-ri', partOfSpeech: 'noun', examples: ['Helikopteri lentää matalalla', 'Helikopteri pelastaa ihmisiä'], categories: ['transport'], difficulty: 'advanced', frequency: 58 },

  // Clothing (12 words)
  { english: 'shirt', finnish: 'paita', pronunciation: 'pay-ta', partOfSpeech: 'noun', examples: ['Paita on sininen', 'Paita on puhdas'], categories: ['clothing'], difficulty: 'beginner', frequency: 84 },
  { english: 'pants', finnish: 'housut', pronunciation: 'hou-sut', partOfSpeech: 'noun', examples: ['Housut ovat mustat', 'Housut ovat pitkät'], categories: ['clothing'], difficulty: 'beginner', frequency: 86 },
  { english: 'dress', finnish: 'mekko', pronunciation: 'mek-ko', partOfSpeech: 'noun', examples: ['Mekko on kaunis', 'Mekko on punainen'], categories: ['clothing'], difficulty: 'beginner', frequency: 78 },
  { english: 'shoes', finnish: 'kengät', pronunciation: 'ken-gat', partOfSpeech: 'noun', examples: ['Kengät suojaavat jalkoja', 'Kengät ovat mukavat'], categories: ['clothing'], difficulty: 'beginner', frequency: 89 },
  { english: 'hat', finnish: 'hattu', pronunciation: 'hat-tu', partOfSpeech: 'noun', examples: ['Hattu suojaa auringolta', 'Hattu on päässä'], categories: ['clothing'], difficulty: 'beginner', frequency: 75 },
  { english: 'coat', finnish: 'takki', pronunciation: 'tak-ki', partOfSpeech: 'noun', examples: ['Takki lämmittää talvella', 'Takki on paksu'], categories: ['clothing'], difficulty: 'beginner', frequency: 82 },
  { english: 'socks', finnish: 'sukat', pronunciation: 'su-kat', partOfSpeech: 'noun', examples: ['Sukat lämmittävät jalkoja', 'Sukat ovat pehmeät'], categories: ['clothing'], difficulty: 'beginner', frequency: 81 },
  { english: 'gloves', finnish: 'käsineet', pronunciation: 'kah-si-neet', partOfSpeech: 'noun', examples: ['Käsineet suojaavat käsiä', 'Käsineet ovat lämpimät'], categories: ['clothing'], difficulty: 'beginner', frequency: 73 },
  { english: 'skirt', finnish: 'hame', pronunciation: 'ha-me', partOfSpeech: 'noun', examples: ['Hame on lyhyt', 'Hame heilahtelee kävellessä'], categories: ['clothing'], difficulty: 'beginner', frequency: 76 },
  { english: 'sweater', finnish: 'villapaita', pronunciation: 'vil-la-pay-ta', partOfSpeech: 'noun', examples: ['Villapaita on lämmin', 'Villapaita on pehmeä'], categories: ['clothing'], difficulty: 'intermediate', frequency: 77 },
  { english: 'scarf', finnish: 'huivi', pronunciation: 'hoo-vi', partOfSpeech: 'noun', examples: ['Huivi suojaa kaulaa', 'Huivi on värikkäs'], categories: ['clothing'], difficulty: 'beginner', frequency: 71 },
  { english: 'belt', finnish: 'vyö', pronunciation: 'vyö', partOfSpeech: 'noun', examples: ['Vyö pitää housut paikallaan', 'Vyö on nahkainen'], categories: ['clothing'], difficulty: 'beginner', frequency: 68 },

  // School & Education (10 words)
  { english: 'school', finnish: 'koulu', pronunciation: 'kou-lu', partOfSpeech: 'noun', examples: ['Koulu opettaa lapsia', 'Koulu alkaa aamulla'], categories: ['education'], difficulty: 'beginner', frequency: 92 },
  { english: 'teacher', finnish: 'opettaja', pronunciation: 'o-pet-ta-ya', partOfSpeech: 'noun', examples: ['Opettaja opettaa matematiikkaa', 'Opettaja on ystävällinen'], categories: ['education'], difficulty: 'beginner', frequency: 88 },
  { english: 'student', finnish: 'opiskelija', pronunciation: 'o-pis-ke-li-ya', partOfSpeech: 'noun', examples: ['Opiskelija lukee kirjaa', 'Opiskelija tekee läksyjä'], categories: ['education'], difficulty: 'beginner', frequency: 89 },
  { english: 'book', finnish: 'kirja', pronunciation: 'kir-ya', partOfSpeech: 'noun', examples: ['Kirja kertoo tarinan', 'Kirja on mielenkiintoinen'], categories: ['education'], difficulty: 'beginner', frequency: 91 },
  { english: 'pen', finnish: 'kynä', pronunciation: 'kü-nah', partOfSpeech: 'noun', examples: ['Kynä kirjoittaa mustetta', 'Kynä on sininen'], categories: ['education'], difficulty: 'beginner', frequency: 83 },
  { english: 'paper', finnish: 'paperi', pronunciation: 'pa-pe-ri', partOfSpeech: 'noun', examples: ['Paperi on valkoista', 'Paperi on ohutta'], categories: ['education'], difficulty: 'beginner', frequency: 85 },
  { english: 'homework', finnish: 'läksyt', pronunciation: 'lak-süt', partOfSpeech: 'noun', examples: ['Läksyt tehdään kotona', 'Läksyt ovat tärkeitä'], categories: ['education'], difficulty: 'intermediate', frequency: 79 },
  { english: 'exam', finnish: 'koe', pronunciation: 'ko-e', partOfSpeech: 'noun', examples: ['Koe testaa oppimista', 'Koe on vaikea'], categories: ['education'], difficulty: 'intermediate', frequency: 76 },
  { english: 'lesson', finnish: 'tunti', pronunciation: 'tun-ti', partOfSpeech: 'noun', examples: ['Tunti kestää 45 minuuttia', 'Tunti on mielenkiintoinen'], categories: ['education'], difficulty: 'beginner', frequency: 87 },
  { english: 'library', finnish: 'kirjasto', pronunciation: 'kir-yas-to', partOfSpeech: 'noun', examples: ['Kirjasto on hiljainen paikka', 'Kirjasto lainaa kirjoja'], categories: ['education'], difficulty: 'intermediate', frequency: 74 },
  { english: 'house', finnish: 'talo', pronunciation: 'ta-lo', partOfSpeech: 'noun', examples: ['Asumme suuressa talossa', 'Talo on kaunis'], categories: ['home'], difficulty: 'beginner', frequency: 88 },
  { english: 'room', finnish: 'huone', pronunciation: 'hoo-ne', partOfSpeech: 'noun', examples: ['Huone on valoisa', 'Nukun omassa huoneessani'], categories: ['home'], difficulty: 'beginner', frequency: 84 },
  { english: 'kitchen', finnish: 'keittiö', pronunciation: 'kayt-ti-o', partOfSpeech: 'noun', examples: ['Keittiö on iso', 'Valmistan ruokaa keittiössä'], categories: ['home'], difficulty: 'intermediate', frequency: 80 },
  { english: 'door', finnish: 'ovi', pronunciation: 'o-vi', partOfSpeech: 'noun', examples: ['Ovi on kiinni', 'Avaa ovi, ole hyvä'], categories: ['home'], difficulty: 'beginner', frequency: 86 },
  { english: 'window', finnish: 'ikkuna', pronunciation: 'ik-ku-na', partOfSpeech: 'noun', examples: ['Ikkuna on auki', 'Katson ikkunasta ulos'], categories: ['home'], difficulty: 'intermediate', frequency: 78 }
];

// Categories data for seeding - Updated with correct counts
const SEED_CATEGORIES_DATA = [
  { id: 'greetings', name: 'Greetings', count: 10, emoji: '👋', description: 'Common greetings and polite expressions' },
  { id: 'family', name: 'Family', count: 12, emoji: '👨‍👩‍👧‍👦', description: 'Family members and relationships' },
  { id: 'animals', name: 'Animals', count: 15, emoji: '🐕', description: 'Common animals and pets' },
  { id: 'food', name: 'Food & Drinks', count: 18, emoji: '🍽️', description: 'Food, drinks and meals' },
  { id: 'colors', name: 'Colors', count: 12, emoji: '🎨', description: 'Basic colors and shades' },
  { id: 'body', name: 'Body Parts', count: 15, emoji: '👤', description: 'Parts of the human body' },
  { id: 'weather', name: 'Weather', count: 12, emoji: '🌤️', description: 'Weather conditions and climate' },
  { id: 'transport', name: 'Transportation', count: 12, emoji: '🚗', description: 'Vehicles and transportation methods' },
  { id: 'clothing', name: 'Clothing', count: 12, emoji: '👕', description: 'Clothes and accessories' },
  { id: 'education', name: 'School & Education', count: 10, emoji: '📚', description: 'School, learning and education' },
  { id: 'home', name: 'Home', count: 5, emoji: '🏠', description: 'House, rooms and furniture' }
];

async function seedFirebaseData() {
  console.log('🌱 Starting Firebase data seeding...');

  try {
    // First, clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Delete all vocabulary
    const vocabularySnapshot = await getDocs(collection(db, 'vocabulary'));
    const vocabularyBatch = writeBatch(db);
    vocabularySnapshot.docs.forEach((document) => {
      vocabularyBatch.delete(document.ref);
    });
    await vocabularyBatch.commit();
    console.log(`✅ Deleted ${vocabularySnapshot.size} existing vocabulary entries`);

    // Delete all categories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categoriesBatch = writeBatch(db);
    categoriesSnapshot.docs.forEach((document) => {
      categoriesBatch.delete(document.ref);
    });
    await categoriesBatch.commit();
    console.log(`✅ Deleted ${categoriesSnapshot.size} existing category entries`);

    // Now upload fresh vocabulary words in batches
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