import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  date:        { type: String, required: true, unique: true }, // "2025-05-22"
  visits:      { type: Number, default: 0 },
  uniqueIPs:   [{ type: String }],
  updatedAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
