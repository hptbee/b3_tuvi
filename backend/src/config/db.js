import { initDatabase } from '../db/sqlite.js';

const connectDB = () => {
    try {
        initDatabase();
    } catch (error) {
        console.error('SQLite init error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
