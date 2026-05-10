const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined.');
  console.log('Usage: node --env-file=.env.local scratch/delete_broken.js');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: String,
  image: [String]
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function pruneBrokenImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');

    const products = await Product.find({});
    console.log(`Checking ${products.length} products...`);

    let deletedCount = 0;

    for (const product of products) {
      if (!product.image || product.image.length === 0) {
        console.log(`[PRUNING] Product "${product.name}" (No image)`);
        await Product.findByIdAndDelete(product._id);
        deletedCount++;
        continue;
      }

      const url = product.image[0];
      try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        if (!res.ok) {
          console.log(`[PRUNING] (${res.status}) Product: "${product.name}"`);
          await Product.findByIdAndDelete(product._id);
          deletedCount++;
        }
      } catch (err) {
        console.log(`[PRUNING] (Error: ${err.name}) Product: "${product.name}"`);
        await Product.findByIdAndDelete(product._id);
        deletedCount++;
      }
    }

    console.log(`\n--- Pruning Complete ---`);
    console.log(`Deleted ${deletedCount} broken products.`);
    console.log(`${products.length - deletedCount} products remain.`);

  } catch (err) {
    console.error('Pruning failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

pruneBrokenImages();
