#!/usr/bin/env node

/**
 * Upload Production Data Script
 * Uploads the full production vocabulary data to Firebase Firestore
 * Usage: npm run admin:upload-full
 *
 * IMPORTANT: This script expects a file named 'production-data.json' in the root directory
 * This file should contain your full 4400+ vocabulary dataset and should be in .gitignore
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Firebase Admin initialization
const serviceAccount = {
  type: "service_account",
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  private_key_id: process.env.VITE_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.VITE_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.VITE_FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.VITE_FIREBASE_CLIENT_X509_CERT_URL
};

async function uploadProductionData() {
  try {
    console.log('🚀 Initializing Firebase Admin...');

    // Initialize Firebase Admin
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID
    });

    const db = getFirestore();

    // Check for production data file
    const productionDataPath = join(__dirname, '..', 'production-data.json');

    if (!existsSync(productionDataPath)) {
      console.error('❌ production-data.json not found!');
      console.error('📝 Please ensure your full vocabulary dataset is saved as "production-data.json" in the root directory.');
      console.error('🔒 Remember: This file should be in your .gitignore to keep your data private.');
      process.exit(1);
    }

    console.log('📖 Loading production data...');

    // Load production data
    const productionData = JSON.parse(readFileSync(productionDataPath, 'utf8'));

    console.log(`📊 Found ${productionData.length} vocabulary entries to upload`);
    console.log('⚠️  This will replace all existing vocabulary data!');

    // Confirm before proceeding
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('🔴 Are you sure you want to upload production data? This will replace all existing data. (yes/no): ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Upload cancelled.');
      process.exit(0);
    }

    // Clear existing vocabulary collection
    console.log('🧹 Clearing existing vocabulary data...');
    const vocabRef = db.collection('vocabulary');
    const existingDocs = await vocabRef.get();

    const deleteBatch = db.batch();
    let deleteCount = 0;
    existingDocs.forEach(doc => {
      deleteBatch.delete(doc.ref);
      deleteCount++;
      if (deleteCount % 500 === 0) {
        console.log(`🗑️  Prepared ${deleteCount} documents for deletion...`);
      }
    });
    await deleteBatch.commit();
    console.log(`🗑️  Deleted ${deleteCount} existing documents`);

    console.log('💾 Uploading production vocabulary data...');

    // Upload production data in batches of 500 (Firestore limit)
    const BATCH_SIZE = 500;
    let totalUploaded = 0;

    for (let i = 0; i < productionData.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const batchData = productionData.slice(i, i + BATCH_SIZE);

      batchData.forEach(word => {
        const docRef = vocabRef.doc(word.id);
        batch.set(docRef, {
          ...word,
          createdAt: new Date(),
          isDemo: false
        });
      });

      await batch.commit();
      totalUploaded += batchData.length;

      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(productionData.length / BATCH_SIZE);
      console.log(`✅ Uploaded batch ${batchNum}/${totalBatches} (${totalUploaded}/${productionData.length} words)`);
    }

    // Update categories if they exist in the data
    console.log('📂 Processing categories...');
    const categoriesRef = db.collection('categories');

    // Extract unique categories from production data
    const categoryMap = new Map();
    productionData.forEach(word => {
      if (word.categoryId) {
        if (!categoryMap.has(word.categoryId)) {
          categoryMap.set(word.categoryId, {
            id: word.categoryId,
            name: word.categoryId.charAt(0).toUpperCase() + word.categoryId.slice(1),
            count: 0,
            emoji: '📚' // Default emoji
          });
        }
        categoryMap.get(word.categoryId).count++;
      }
    });

    // Upload categories
    for (const [id, category] of categoryMap) {
      await categoriesRef.doc(id).set({
        ...category,
        createdAt: new Date(),
        isDemo: false
      });
    }

    console.log(`📂 Created/updated ${categoryMap.size} categories`);

    // Update metadata
    console.log('📝 Updating metadata...');
    await db.collection('metadata').doc('vocabulary').set({
      lastUpdated: new Date(),
      totalWords: productionData.length,
      isDemo: false,
      version: '1.0.0-production'
    });

    console.log('🎉 Production data upload complete!');
    console.log(`📊 ${productionData.length} vocabulary words uploaded`);
    console.log(`📂 ${categoryMap.size} categories processed`);
    console.log('🚀 Your app now contains full production data!');

  } catch (error) {
    console.error('❌ Error uploading production data:', error);
    process.exit(1);
  }
}

// Run the upload
uploadProductionData();