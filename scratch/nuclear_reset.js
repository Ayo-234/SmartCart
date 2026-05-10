const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined.');
  console.log('Usage: node --env-file=.env.local scratch/nuclear_reset.js');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: String
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function nuclearReset() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    console.log('--- NUCLEAR RESET STARTED ---');
    console.log('Wiping all products from the database...');
    
    const result = await Product.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} products.`);
    console.log('Database is now clean and ready for fresh seeding.');
    console.log('--- NUCLEAR RESET COMPLETE ---');

  } catch (err) {
    console.error('Nuclear Reset failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

nuclearReset();
