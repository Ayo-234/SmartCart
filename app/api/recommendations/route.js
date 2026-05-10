import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Interaction from '@/models/Interaction';
import Recommendation from '@/models/Recommendation';
import { getRecommendationKeywords } from '@/lib/ai';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    await connectDB();

    // 1. Check for cached recommendations
    const cacheQuery = userId ? { userId } : { sessionId };
    const cached = await Recommendation.findOne(cacheQuery).sort({ createdAt: -1 });

    if (cached && cached.expiresAt > new Date()) {
      const keywords = cached.keywords;
      const orConditions = keywords.map(kw => ({
        $or: [
          { name: { $regex: kw, $options: 'i' } },
          { category: { $regex: kw, $options: 'i' } },
          { description: { $regex: kw, $options: 'i' } },
          { aiTags: { $in: [new RegExp(kw, 'i')] } },
        ],
      }));

      const recommended = await Product.find({ $or: orConditions.flatMap(c => c.$or) }).limit(8);
      return NextResponse.json({ type: 'ai-personalized', products: recommended, keywords, cached: true });
    }

    // 2. Build query to find recent user interactions
    const query = userId ? { userId } : { sessionId };
    const interactions = await Interaction.find(query)
      .populate('productId', 'name category aiTags')
      .sort({ createdAt: -1 })
      .limit(20);

    // Cold start: no history → return trending/popular products
    if (interactions.length === 0) {
      const trending = await Product.find({})
        .sort({ 'stats.views': -1, 'stats.sales': -1 })
        .limit(8);
      return NextResponse.json({ type: 'trending', products: trending });
    }

    // Build interaction history for AI prompt
    const historyForAI = interactions.map(i => ({
      actionType: i.actionType,
      productName: i.productId?.name || 'Unknown',
      category: i.productId?.category || 'Unknown',
    }));

    // 3. Get AI-generated recommendation keywords from Gemini
    let keywords = await getRecommendationKeywords(historyForAI);
    let type = 'ai-personalized';

    // Fallback: use categories from history if AI returns empty (includes 429 case)
    if (keywords.length === 0) {
      keywords = [...new Set(historyForAI.map(i => i.category))].filter(Boolean);
      type = 'category-based';
    }

    // Cold start fallback if keywords still empty
    if (keywords.length === 0) {
      const trending = await Product.find({})
        .sort({ 'stats.views': -1, 'stats.sales': -1 })
        .limit(8);
      return NextResponse.json({ type: 'trending', products: trending });
    }

    // 4. Cache the new recommendations (even if they are fallback category-based)
    await Recommendation.create({
      userId: userId || null,
      sessionId,
      keywords,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Reduce to 30 mins for more dynamic updates, but still prevents refresh hammering
    });

    // Use keywords to query MongoDB with text-like search
    const orConditions = keywords.map(kw => ({
      $or: [
        { name: { $regex: kw, $options: 'i' } },
        { category: { $regex: kw, $options: 'i' } },
        { description: { $regex: kw, $options: 'i' } },
        { aiTags: { $in: [new RegExp(kw, 'i')] } },
      ],
    }));

    const recommended = await Product.find({ $or: orConditions.flatMap(c => c.$or) })
      .limit(8);

    return NextResponse.json({ type, products: recommended, keywords });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

// Track user interactions (views, clicks, searches)
export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, userId, productId, actionType, metadata } = body;

    if (!sessionId || !productId || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const interaction = await Interaction.create({
      sessionId,
      userId: userId || null,
      productId,
      actionType,
      metadata,
    });

    // Increment product view/click stats
    if (actionType === 'view') {
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.views': 1 } });
    } else if (actionType === 'purchase') {
      await Product.findByIdAndUpdate(productId, { $inc: { 'stats.sales': 1 } });
    }

    return NextResponse.json({ success: true, interactionId: interaction._id });
  } catch (error) {
    console.error('Track interaction error:', error);
    return NextResponse.json({ error: 'Failed to track interaction' }, { status: 500 });
  }
}
