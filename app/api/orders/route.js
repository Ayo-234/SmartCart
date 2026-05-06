import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
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

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
