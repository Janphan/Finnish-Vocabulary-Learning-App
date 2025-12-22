#!/usr/bin/env node

/**
 * Upload Sample Data Script
 * Uploads the demo vocabulary data (sample-data.json) to Firebase Firestore
 * Usage: npm run seed:demo
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
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

async function uploadSampleData() {
  try {
    console.log('🚀 Initializing Firebase Admin...');

    // Initialize Firebase Admin
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID
    });

    const db = getFirestore();

    console.log('📖 Loading sample data...');

    // Load sample data
    const sampleDataPath = join(__dirname, '..', 'sample-data.json');
    const sampleData = JSON.parse(readFileSync(sampleDataPath, 'utf8'));

    console.log(`📊 Found ${sampleData.length} vocabulary entries to upload`);

    // Clear existing vocabulary collection
    console.log('🧹 Clearing existing vocabulary data...');
    const vocabRef = db.collection('vocabulary');
    const existingDocs = await vocabRef.get();

    const batch = db.batch();
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log('💾 Uploading sample vocabulary data...');

    // Upload sample data in batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < sampleData.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const batchData = sampleData.slice(i, i + BATCH_SIZE);

      batchData.forEach(word => {
        const docRef = vocabRef.doc(word.id);
        batch.set(docRef, {
          ...word,
          createdAt: new Date(),
          isDemo: true
        });
      });

      await batch.commit();
      console.log(`✅ Uploaded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sampleData.length / BATCH_SIZE)}`);
    }

    // Create/update categories
    console.log('📂 Creating sample categories...');
    const categoriesRef = db.collection('categories');

    const sampleCategories = [
      { id: 'animals', name: 'Animals', emoji: '🐾', count: 3 },
      { id: 'food', name: 'Food & Drink', emoji: '🍽️', count: 3 },
      { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦', count: 2 },
      { id: 'education', name: 'Education', emoji: '📚', count: 3 },
      { id: 'descriptions', name: 'Descriptions', emoji: '🎨', count: 3 },
      { id: 'actions', name: 'Actions', emoji: '🏃', count: 1 },
      { id: 'travel', name: 'Travel', emoji: '✈️', count: 1 },
      { id: 'emotions', name: 'Emotions', emoji: '😊', count: 1 },
      { id: 'home', name: 'Home', emoji: '🏠', count: 1 },
      { id: 'transport', name: 'Transport', emoji: '🚗', count: 1 },
      { id: 'people', name: 'People', emoji: '👥', count: 1 }
    ];

    for (const category of sampleCategories) {
      await categoriesRef.doc(category.id).set({
        ...category,
        createdAt: new Date(),
        isDemo: true
      });
    }

    // Update metadata
    console.log('📝 Updating metadata...');
    await db.collection('metadata').doc('vocabulary').set({
      lastUpdated: new Date(),
      totalWords: sampleData.length,
      isDemo: true,
      version: '1.0.0-demo'
    });

    console.log('🎉 Demo data upload complete!');
    console.log(`📊 ${sampleData.length} vocabulary words uploaded`);
    console.log(`📂 ${sampleCategories.length} categories created`);
    console.log('🚀 Your app is ready with demo data!');

  } catch (error) {
    console.error('❌ Error uploading demo data:', error);
    process.exit(1);
  }
}

// Run the upload
uploadSampleData();