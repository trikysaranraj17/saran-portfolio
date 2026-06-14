import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  subject:   { type: String, required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
