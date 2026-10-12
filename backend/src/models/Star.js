import mongoose from 'mongoose';

/**
 * Collection: stars
 * Hồ sơ chi tiết từng vì sao (Ngũ hành, Đắc/Hãm, Ý nghĩa theo cung).
 * Dữ liệu gốc để AI hiểu sâu về thuộc tính các sao.
 */
const StarSchema = new mongoose.Schema({
    name:          { type: String, required: true, unique: true },
    element:       { type: String, enum: ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', ''] },
    group:         { type: String, enum: ['chinh_tinh', 'phu_tinh', 'hoa_tinh', 'vong_trang_sinh', 'other'] },
    basic_meaning: { type: String, required: true },
    // Ý nghĩa theo từng cung — Map: { 'Mệnh': '...', 'Quan Lộc': '...', 'default': '...' }
    palace_meanings: { type: Map, of: String, default: {} },
    rules: [{
        condition:   { type: String }, // 'Đắc Địa', 'Bình Hòa', 'Hãm Địa'
        description: { type: String }
    }]
}, { timestamps: true, collection: 'stars' });

export default mongoose.model('Star', StarSchema);
