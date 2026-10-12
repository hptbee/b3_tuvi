import mongoose from 'mongoose';

/**
 * Collection: horoscopes
 * Lưu trữ dữ liệu lá số đầy đủ của người dùng.
 * Đây là nguồn dữ liệu quan trọng nhất để AI thực hiện RAG và luận giải.
 */
const HoroscopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    // Thông tin đầu vào
    input_data: {
        name:   { type: String, default: '' },
        day:    { type: Number, required: true },
        month:  { type: Number, required: true },
        year:   { type: Number, required: true },
        hour:   { type: Number, required: true },
        gender: { type: Number, required: true }  // 1=Nam, -1=Nữ
    },
    // Thông tin quy đổi âm lịch
    lunar_data: {
        lunarDay:   Number,
        lunarMonth: Number,
        lunarYear:  Number,
        canIndex:   Number,
        chiIndex:   Number,
        isLeap:     Boolean,
        anSaoMonth: Number
    },
    // Bản đồ lá số đầy đủ (12 cung, mỗi cung có danh sách sao)
    full_chart: { type: Object, required: true },
    // Metadata
    is_public: { type: Boolean, default: false },
    notes:     { type: String, default: '' }
}, { timestamps: true, collection: 'horoscopes' });

export default mongoose.model('Horoscope', HoroscopeSchema);
