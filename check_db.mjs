import mongoose from 'mongoose';
import Combination from './backend/src/models/Combination.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/tuvi';

async function check() {
    await mongoose.connect(MONGO_URI);
    const combos = await Combination.find({ name: /Phủ Tướng Triều Viên/i });
    console.log(JSON.stringify(combos, null, 2));
    await mongoose.disconnect();
}
check().catch(console.error);
