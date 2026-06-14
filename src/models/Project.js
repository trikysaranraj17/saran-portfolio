import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  url:         { type: String, required: true },
  description: { type: String, required: true },
  tags:        [{ type: String }],
  viewCount:   { type: Number, default: 0 },
  accentColor: { type: String },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
