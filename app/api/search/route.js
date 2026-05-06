import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { expandSearchQuery } from '@/lib/ai';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const ai = searchParams.get('ai') === 'true';

    if (!q.trim()) {
      return NextResponse.json({ products: [], query: q });
    }

    await connectDB();

    let searchTerms = [q];

    // AI-enhanced search
    if (ai) {
      try {
        const expanded = await expandSearchQuery(q);
        if (expanded.length > 0) searchTerms = expanded;
      } catch {
        // fallback to original query
      }
    }

    const orConditions = searchTerms.flatMap(term => [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { category: { $regex: term, $options: 'i' } },
      { aiTags: { $in: [new RegExp(term, 'i')] } },
    ]);

    const products = await Product.find({ $or: orConditions })
      .sort({ stats: -1, createdAt: -1 })
      .limit(50);

    return NextResponse.json({ products, query: q, aiTerms: ai ? searchTerms : null });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
