import './fix_env.js';
import connectDB from '../lib/mongodb.js';
import Product from '../models/Product.js';

async function deleteProjector() {
  await connectDB();
  const name = 'Samsung Projector 4k';
  const result = await Product.deleteOne({ name });
  if (result.deletedCount > 0) {
    console.log('Successfully deleted:', name);
  } else {
    console.log('Product not found or already deleted:', name);
  }
  process.exit(0);
}

deleteProjector();
