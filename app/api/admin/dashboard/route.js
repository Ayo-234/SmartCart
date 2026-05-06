import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      topProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Order.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(10),
      Product.find({ stock: { $lte: 5 } }).limit(10),
      Product.find().sort({ 'stats.sales': -1 }).limit(5),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      lowStockProducts,
      topProducts,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
