import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      fullName: String,
      phoneNumber: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    paymentDetails: {
      reference: String,
      status: String,
      paidAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
