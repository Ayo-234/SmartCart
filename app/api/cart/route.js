import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('cartItems');
    return NextResponse.json({ cartItems: user?.cartItems || {} });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);

    const currentQty = user.cartItems?.get?.(productId) || user.cartItems?.[productId] || 0;
    const newQty = currentQty + quantity;

    // Handle both Map and plain object
    if (user.cartItems instanceof Map) {
      user.cartItems.set(productId, newQty);
    } else {
      user.cartItems = { ...user.cartItems, [productId]: newQty };
    }

    user.markModified('cartItems');
    await user.save();

    return NextResponse.json({ cartItems: user.cartItems });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);

    if (user.cartItems instanceof Map) {
      if (quantity <= 0) {
        user.cartItems.delete(productId);
      } else {
        user.cartItems.set(productId, quantity);
      }
    } else {
      const cart = { ...user.cartItems };
      if (quantity <= 0) {
        delete cart[productId];
      } else {
        cart[productId] = quantity;
      }
      user.cartItems = cart;
    }

    user.markModified('cartItems');
    await user.save();

    return NextResponse.json({ cartItems: user.cartItems });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    await connectDB();
    const user = await User.findById(payload.userId);

    if (user.cartItems instanceof Map) {
      if (productId) {
        user.cartItems.delete(productId);
      } else {
        user.cartItems.clear();
      }
    } else {
      if (productId) {
        const cart = { ...user.cartItems };
        delete cart[productId];
        user.cartItems = cart;
      } else {
        user.cartItems = {};
      }
    }

    user.markModified('cartItems');
    await user.save();

    return NextResponse.json({ cartItems: user.cartItems });
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
