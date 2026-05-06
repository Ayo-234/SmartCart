import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '1h' }, // Auto-delete after 1 hour
    },
  },
  { timestamps: true }
);

// Index to find by user or session
RecommendationSchema.index({ userId: 1, sessionId: 1 });

export default mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
