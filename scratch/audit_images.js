const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined.');
  console.log('Usage: node --env-file=.env.local scratch/audit_images.js');
  process.exit(1);
}

// Minimal Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  image: [String],
  category: String
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function auditImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Starting audit...\n`);

    let brokenCount = 0;
    let totalImages = 0;

    for (const product of products) {
      if (!product.image || product.image.length === 0) {
        console.warn(`[WARNING] Product "${product.name}" has no images.`);
        continue;
      }

      for (const url of product.image) {
        totalImages++;
        try {
          // Use HEAD request to check availability
          const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          
          if (!res.ok) {
            brokenCount++;
            console.error(`[BROKEN] (${res.status}) Product: "${product.name}" | URL: ${url}`);
          }
        } catch (err) {
          brokenCount++;
          console.error(`[ERROR] (${err.name}) Product: "${product.name}" | URL: ${url}`);
        }
      }
    }

    console.log(`\n--- Audit Complete ---`);
    console.log(`Total Images Checked: ${totalImages}`);
    console.log(`Broken Links Found: ${brokenCount}`);
    
    if (brokenCount === 0) {
      console.log('Great! All image links are active.');
    } else {
      console.log('Please review the broken links listed above.');
    }

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

auditImages();
