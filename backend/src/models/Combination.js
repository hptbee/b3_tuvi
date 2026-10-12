import mongoose from 'mongoose';

/**
 * Collection: combinations
 * Lưu trữ các Cách Cục (tổ hợp sao đặc biệt) — dùng cho Pattern Matching và AI luận giải.
 */
const CombinationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },

    // Phân loại cách cục
    type: {
        type: String,
        enum: ['cat_cach', 'hung_bai_cach', 'dac_biet_cach'],
        required: true
    },

    description: { type: String, required: true },

    // Điều kiện để ENGINE nhận diện (Logic cứng — Pattern Matching)
    logic_conditions: {
        // Các sao bắt buộc phải có
        required_stars:   { type: [String], default: [] },
        // Các sao KHÔNG được có (phá cách)
        excluded_stars:   { type: [String], default: [] },
        // Vị trí/cung phải đứng (ví dụ: "Dần", "Thân", "Tý", "Ngọ")
        required_palaces: { type: [String], default: [] },
        // Mối quan hệ vị trí ("Tam hợp", "Đồng cung", "Xung chiếu", "Nhị hợp")
        positions:        { type: [String], default: [] },
        // Mô tả điều kiện tự do (dùng khi logic quá phức tạp)
        formula_text:     { type: String, default: '' },
        require_ham:      { type: [String], default: [] },
        require_no_major_at_menh: { type: Boolean, default: false }
    },

    verification_status: {
        type: String,
        enum: ['matching_ok', 'provisional', 'disabled'],
        default: 'provisional'
    },
    disclaimer: { type: String, default: '' },
    notes: { type: String, default: '' },

    // Các đoạn luận giải theo ngữ cảnh — AI dùng để viết bài
    interpretations: [{
        context: { type: String, required: true },  // Ví dụ: "Mệnh tại Dần/Thân", "Gặp Không Kiếp"
        content: { type: String, required: true },
        tags:    { type: [String], default: [] }
    }],

    // Từ khóa để AI tìm kiếm nhanh
    tags: { type: [String], default: [] },

    // Placeholder cho vector embedding (AI semantic search)
    vector_embedding: { type: [Number], default: [] }

}, { timestamps: true, collection: 'combinations' });

CombinationSchema.index({ type: 1 });
CombinationSchema.index({ tags: 1 });
CombinationSchema.index({ 'logic_conditions.required_stars': 1 });

export default mongoose.model('Combination', CombinationSchema);
