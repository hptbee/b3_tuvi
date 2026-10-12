/**
 * Cleanup script: Xóa sạch dữ liệu hardcode (Stars, Palaces, Combinations, Horoscopes) khỏi MongoDB.
 * Chạy: node src/scripts/cleanup.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Star from '../models/Star.js';
import Palace from '../models/Palace.js';
import Combination from '../models/Combination.js';
import Horoscope from '../models/Horoscope.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // 1. Xóa Stars
    console.log('📌 Cleaning Stars...');
    const starResult = await Star.deleteMany({});
    console.log(`   ✓ Removed ${starResult.deletedCount} stars.`);

    // 2. Xóa Palaces
    console.log('📌 Cleaning Palaces...');
    const palaceResult = await Palace.deleteMany({});
    console.log(`   ✓ Removed ${palaceResult.deletedCount} palaces.`);

    // 3. Xóa Combinations
    console.log('📌 Cleaning Combinations...');
    const comboResult = await Combination.deleteMany({});
    console.log(`   ✓ Removed ${comboResult.deletedCount} combinations.`);

    // 4. Xóa Horoscopes (Dữ liệu đã migrate từ charts)
    console.log('📌 Cleaning Horoscopes...');
    const horoscopeResult = await Horoscope.deleteMany({});
    console.log(`   ✓ Removed ${horoscopeResult.deletedCount} horoscopes.`);

    // 5. Xóa Charts (Dữ liệu cũ)
    console.log('📌 Cleaning Old Charts...');
    const chartsResult = await mongoose.connection.db.collection('charts').deleteMany({});
    console.log(`   ✓ Removed ${chartsResult.deletedCount} old charts.`);

    // 6. Xóa Meanings (Dữ liệu cũ)
    console.log('📌 Cleaning Meanings...');
    const meaningsResult = await mongoose.connection.db.collection('meanings').deleteMany({});
    console.log(`   ✓ Removed ${meaningsResult.deletedCount} old meanings.`);

    console.log('\n✨ Cleanup complete! Database is now empty of hardcoded seeded and old data.');
    
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected');
  }
}

cleanup();
