import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// Helper to validate image URL
async function isImageValid(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

// GET all products (with optional search/filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const sort = searchParams.get('sort') || 'newest';
    const skip = (page - 1) * limit;

    await connectDB();

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'popular') {
      sortQuery = { 'stats.sales': -1, 'stats.views': -1, rating: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    } else if (sort === 'price-low') {
      sortQuery = { price: 1 };
    } else if (sort === 'price-high') {
      sortQuery = { price: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortQuery),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create a new product (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image, aiTags, stock, upsert = false } = body;

    if (!name || !description || !price || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct && !upsert) {
      return NextResponse.json({ 
        error: 'Product already exists', 
        product: existingProduct,
        skipped: true 
      }, { status: 409 });
    }

    // Validate image URL before saving
    const imageUrl = Array.isArray(image) ? image[0] : image;
    if (imageUrl && !(await isImageValid(imageUrl))) {
      return NextResponse.json({ error: 'Image URL is broken or inaccessible' }, { status: 400 });
    }

    // Use findOneAndUpdate with upsert to either update (if upsert: true) or create
    const product = await Product.findOneAndUpdate(
      { name }, 
      { description, price, offerPrice: body.offerPrice || price, category, image, aiTags, stock },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json({ product }, { status: existingProduct ? 200 : 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// DELETE products (bulk or cleanup)
export async function DELETE(request) {
  try {
    const { names, cleanup = false } = await request.json();

    await connectDB();

    let result;
    if (cleanup && names) {
      // Delete products that are NOT in the provided names list
      result = await Product.deleteMany({ name: { $nin: names } });
    } else if (names && names.length > 0) {
      // Delete specific products by name
      result = await Product.deleteMany({ name: { $in: names } });
    } else if (cleanup) {
      // If cleanup is true but no names provided, delete EVERYTHING (reset)
      result = await Product.deleteMany({});
    } else {
      return NextResponse.json({ error: 'Missing deletion criteria' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Deletion successful', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Delete products error:', error);
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
  }
}
