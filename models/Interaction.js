import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest tracking by session
    },
    sessionId: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    actionType: {
      type: String,
      enum: ['view', 'click', 'search', 'purchase', 'add_to_cart'],
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);
