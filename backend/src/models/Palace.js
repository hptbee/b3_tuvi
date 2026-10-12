import mongoose from 'mongoose';

/**
 * Collection: palaces
 * Định nghĩa ý nghĩa của 12 Cung chức năng và cung Thân.
 * Cấu trúc nền tảng để phân loại các khía cạnh đời sống trong Tử Vi.
 */
const PalaceSchema = new mongoose.Schema({
    palace_name:  { type: String, required: true, unique: true },
    short_name:   { type: String },                            // Tên hiển thị ngắn
    core_meaning: { type: String, required: true },            // Ý nghĩa cốt lõi
    life_aspect:  { type: [String], default: [] },             // Khía cạnh đời sống (sự nghiệp, tình cảm...)
    keywords:     { type: [String], default: [] },             // Từ khóa để AI query nhanh
}, { timestamps: true, collection: 'palaces' });

export default mongoose.model('Palace', PalaceSchema);
