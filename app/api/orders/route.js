import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Interaction from '@/models/Interaction';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, amount, address, paymentDetails } = await request.json();

    if (!items || !amount || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.create({
      userId: payload.userId,
      items,
      amount,
      address,
      paymentDetails,
      status: paymentDetails?.status === 'success' ? 'Paid' : 'Order Placed',
    });

    // Update product stats and track interactions
    for (const item of items) {
      const productId = item.product._id;
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.sales': item.quantity } });
      
      // Track purchase interaction
      await Interaction.create({
        userId: payload.userId,
        sessionId: 'order-' + order._id, // Fallback since session ID isn't passed here, but userId is available
        productId,
        actionType: 'purchase',
        metadata: { orderId: order._id, quantity: item.quantity }
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
