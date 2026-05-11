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

    // 2. Build query to find recent user interactions (views, purchases, and SEARCHES)
    const query = userId ? { userId } : { sessionId };
    const interactions = await Interaction.find(query)
      .populate('productId', 'name category aiTags')
      .sort({ createdAt: -1 })
      .limit(30);

    // Cold start: no history → return trending/popular products
    if (interactions.length === 0) {
      const trending = await Product.find({})
        .sort({ 'stats.views': -1, 'stats.sales': -1 })
        .limit(8);
      return NextResponse.json({ type: 'trending', products: trending });
    }

    // Build interaction history for AI prompt
    const historyForAI = interactions.map(i => {
      if (i.actionType === 'search') {
        return { type: 'search', query: i.searchQuery };
      }
      return {
        actionType: i.actionType,
        productName: i.productId?.name || 'Unknown',
        category: i.productId?.category || 'Unknown',
        tags: i.productId?.aiTags || []
      };
    });

    // 3. Get AI-generated recommendation keywords
    let keywords = await getRecommendationKeywords(historyForAI);
    let type = 'ai-personalized';

    // FALLBACK: Content-Based Filtering via Tags
    if (keywords.length === 0) {
      // Find the most common tags in user's history
      const allTags = interactions
        .flatMap(i => i.productId?.aiTags || [])
        .filter(Boolean);
      
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      // Get top 3 most frequent tags
      keywords = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      type = 'tag-based';
    }

    // Cold start fallback if keywords still empty
    if (keywords.length === 0) {
      const trending = await Product.find({})
        .sort({ 'stats.views': -1, 'stats.sales': -1 })
        .limit(8);
      return NextResponse.json({ type: 'trending', products: trending });
    }

    // 4. Cache and Query
    await Recommendation.create({
      userId: userId || null,
      sessionId,
      keywords,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    const orConditions = keywords.map(kw => ({
      $or: [
        { name: { $regex: kw, $options: 'i' } },
        { category: { $regex: kw, $options: 'i' } },
        { aiTags: { $in: [new RegExp(`^${kw}$`, 'i'), new RegExp(kw, 'i')] } },
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
    const { sessionId, userId, productId, actionType, searchQuery, metadata } = body;

    if (!sessionId || (!productId && actionType !== 'search') || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const interaction = await Interaction.create({
      sessionId,
      userId: userId || null,
      productId: productId || null,
      actionType,
      searchQuery,
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
