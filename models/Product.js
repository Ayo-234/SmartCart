import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    aiTags: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },
    stats: {
      views: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text', aiTags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
