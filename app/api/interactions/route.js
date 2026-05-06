import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Interaction from '@/models/Interaction';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, productId, actionType, metadata, searchQuery } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await connectDB();

    const payload = await verifyAuth(request);
    const userId = payload?.userId || null;

    // Handle search interactions differently
    if (actionType === 'search' && searchQuery) {
      if (userId) {
        await connectDB();
        const User = (await import('@/models/User')).default;
        await User.findByIdAndUpdate(userId, {
          $push: { searchHistory: { $each: [searchQuery], $slice: -20 } },
        });
      }

      await Interaction.create({
        sessionId,
        userId,
        actionType: 'search',
        metadata: { searchQuery },
      });

      return NextResponse.json({ success: true });
    }

    if (!productId || !actionType) {
      return NextResponse.json({ error: 'Product ID and action type required' }, { status: 400 });
    }

    const interaction = await Interaction.create({
      sessionId,
      userId,
      productId,
      actionType,
      metadata,
    });

    // Update product stats
    if (actionType === 'view') {
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.views': 1 } });
    } else if (actionType === 'click') {
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.clicks': 1 } });
    } else if (actionType === 'purchase') {
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.sales': 1 } });
    }

    return NextResponse.json({ success: true, interactionId: interaction._id });
  } catch (error) {
    console.error('Track interaction error:', error);
    return NextResponse.json({ error: 'Failed to track interaction' }, { status: 500 });
  }
}
