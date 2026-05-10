const fs = require('fs');

const categories = {
  Fashion: [
    'Velvet Evening Gown', 'Urban Street Hoodie', 'Classic Denim Jacket', 'Leather Chelsea Boots', 
    'Silk Floral Scarf', 'Tailored Wool Blazer', 'Linen Summer Shirt', 'Canvas Retro Sneakers', 
    'Vintage Suede Handbag', 'Modern Fit Chinos', 'Cashmere Winter Sweater', 'Active Training Leggings',
    'Bohemian Maxi Dress', 'Aviator Polarized Sunglasses', 'Gold Plated Necklace', 'Knitted Beanie Hat',
    'Cotton Polo Shirt', 'High-Waist Flare Jeans', 'Running Performance Shoes', 'Quilted Puffer Vest'
  ],
  'Home Decor': [
    'Hand-Painted Ceramic Vase', 'Lavender Scented Candle', 'Geometric Wall Mirror', 'Hand-Woven Area Rug', 
    'Abstract Modern Canvas', 'Minimalist Desk Lamp', 'Brass Candle Holder', 'Artificial Olive Tree', 
    'Cotton Textured Throw', 'Industrial Wall Clock', 'Glass Display Terrarium', 'Decorative Velvet Pillow',
    'Macrame Wall Hanging', 'Porcelain Jewelry Dish', 'Floating Wood Shelves', 'Reed Scent Diffuser'
  ],
  Kitchen: [
    'Professional Chef Knife', 'Cast Iron Dutch Oven', 'Stainless Steel Toaster', 'Bamboo Cutting Board Set', 
    'Electric Burr Grinder', 'Glass Airtight Containers', 'Silicone Cooking Utensils', 'Ceramic Dinnerware Set', 
    'Digital Kitchen Scale', 'French Press Coffee Maker', 'Non-Stick Crepe Pan', 'Copper Moscow Mule Mugs',
    'Electric Milk Frother', 'Mixing Bowl Set', 'Tea Infuser Pitcher', 'Herb Garden Kit'
  ],
  Beauty: [
    'Vitamin C Brightening Serum', 'Matte Long-Lasting Lipstick', 'Organic Rosewater Toner', 'Hydrating Hyaluronic Cream', 
    'Dead Sea Mud Mask', 'Nourishing Argan Hair Oil', 'Mineral Daily Sunscreen', 'Charcoal Detox Cleanser', 
    'Under-Eye Recovery Gel', 'Botanical Body Wash', 'Smoothing Primer Base', 'Shimmer Eyeshadow Palette'
  ],
  Fitness: [
    'High-Density Yoga Mat', 'Adjustable Power Dumbbells', 'Latex Resistance Bands', 'Speed Jump Rope', 
    'Anti-Burst Exercise Ball', 'Trigger Point Foam Roller', 'Insulated Sports Bottle', 'Gym Duffel Bag', 
    'Compression Knee Sleeves', 'Digital Fitness Tracker', 'Weighted Training Vest', 'Yoga Support Blocks'
  ],
  Furniture: [
    'Mid-Century Modern Armchair', 'Solid Walnut Office Desk', 'Scandinavian Coffee Table', 'Upholstered King Bed Frame', 
    'Industrial Bookshelf Unit', 'Tufted Storage Ottoman', 'Ergonomic Task Chair', 'Minimalist Bedside Table', 
    'Extendable Dining Table', 'Curved Floor Lamp'
  ]
};

const techProducts = [
  { name: 'Titan G15 Gaming Laptop', category: 'Laptop', price: 1450000, img: 'photo-1603302576837-37561b2e2302' },
  { name: 'Nova Air Ultrabook', category: 'Laptop', price: 950000, img: 'photo-1496181133206-80ce9b88a853' },
  { name: 'Zenith Studio Workstation', category: 'Laptop', price: 2100000, img: 'photo-1517336714731-489689fd1ca8' },
  { name: 'Nexus X10 Pro Smartphone', category: 'Smartphone', price: 680000, img: 'photo-1511707171634-5f897ff02aa9' },
  { name: 'Echo Phone Z Fold', category: 'Smartphone', price: 1250000, img: 'photo-1580910051074-3eb694886505' },
  { name: 'Swift Mobile Prime', category: 'Smartphone', price: 450000, img: 'photo-1523206489230-c012c64b2b48' },
  { name: 'Aura Wireless Earbuds', category: 'Earphone', price: 85000, img: 'photo-1505740420928-5e560c06d30e' },
  { name: 'Titan ANC Headphones', category: 'Headphone', price: 280000, img: 'photo-1505740420928-5e560c06d30e' },
  { name: 'Nova Soundbar System', category: 'Accessories', price: 150000, img: 'photo-1545454675-3531b543bb5b' },
  { name: 'Zenith Smart Watch S', category: 'Watch', price: 195000, img: 'photo-1523275335684-37898b6baf30' },
  { name: 'Echo Fit Fitness Band', category: 'Watch', price: 45000, img: 'photo-1510017803434-a899398421b3' },
  { name: 'Apex 4K DSLR Camera', category: 'Camera', price: 850000, img: 'photo-1516035069174-ce6858a99d2b' },
  { name: 'Luxe Mirrorless Alpha', category: 'Camera', price: 1550000, img: 'photo-1510127034890-ba27508e9f1c' },
  { name: 'Pure Stream Microphone', category: 'Accessories', price: 120000, img: 'photo-1590602847861-f357a9332bbc' },
  { name: 'Swift Mechanical Keyboard', category: 'Accessories', price: 95000, img: 'photo-1511467687858-23d96c32e4ae' },
  { name: 'Titan 32" Curved Monitor', category: 'Accessories', price: 350000, img: 'photo-1527443224154-c4a3942d3acf' }
];

// Helper to get random image from Unsplash categories
const getUnsplashUrl = (id) => `https://images.unsplash.com/${id}?q=80&w=1000&auto=format&fit=crop`;

// Curated Stable IDs (200 unique IDs)
const stableIds = [
  'photo-1523381210434-271e8be1f52b', 'photo-1542291026-7eec264c27ff', 'photo-1595341888016-a392ef81b7de',
  'photo-1584917865442-de89df76afd3', 'photo-1522335789203-aabd1fc54bc9', 'photo-1540555700478-4be289fbecee',
  'photo-1583847268964-b28dc2f51ac9', 'photo-1513694203232-719a280e022f', 'photo-1556911223-e1534ff6fb9b',
  'photo-1526170375885-4d8ecf77b99f', 'photo-1517836357463-d25dfeac3438', 'photo-1515886657613-9f3515b0c78f',
  'photo-1491553895911-0055eca6402d', 'photo-1525966222134-fcfa99b8ae77', 'photo-1560343090-f0409e92791a',
  'photo-1572635196237-14b3f281503f', 'photo-1581539250439-c96689b516dd', 'photo-1586023492125-27b2c045efd7',
  'photo-1534349762230-e0929b7a4844', 'photo-1556910103-1c02745aae4d', 'photo-1594212699903-ec8a3eca50f5',
  'photo-1512496015851-a90fb38ba796', 'photo-1590439474822-39c286470877', 'photo-1517438476312-10d79c67750d',
  'photo-1554469384-e58fac16e23a', 'photo-1540189549336-e6e99c3679fe', 'photo-1518481612222-68bbe828eba1',
  'photo-1533228892524-7dec7ece476f', 'photo-1483721310020-03333e577078', 'photo-1531933355459-4ac9db9403f0',
  'photo-1503342217505-b0a15ec3261c', 'photo-1496747611176-843222e1e57c', 'photo-1492707892479-7bc2d5a7176e',
  'photo-1505022610485-0249ba5b3675', 'photo-1479064566235-aa27a5c9318e', 'photo-1520975661595-6453be3f7070',
  'photo-1516762689617-e1cffcef479d', 'photo-1549298916-b41d501d3772', 'photo-1460353581641-37baddab0fa2',
  'photo-1445205170230-053b830c6050', 'photo-1485230895905-ec17ba36b5bc', 'photo-1515378791036-0648a3ef77b2',
  'photo-1495121605193-b116b5b9c5fe', 'photo-1512436991641-6745cdb1723f', 'photo-1516257984-b1b4d757418a',
  'photo-1517841905240-472988babdf9', 'photo-1511707171634-5f897ff02aa9', 'photo-1505740420928-5e560c06d30e',
  'photo-1542272604-787c3835535d', 'photo-1496181133206-80ce9b88a853', 'photo-1486312338219-ce68d2c6f44d',
  'photo-1517336714731-489689fd1ca8', 'photo-1515378791036-0648a3ef77b2', 'photo-1523275335684-37898b6baf30',
  'photo-1510017803434-a899398421b3', 'photo-1516035069174-ce6858a99d2b', 'photo-1510127034890-ba27508e9f1c',
  'photo-1590602847861-f357a9332bbc', 'photo-1511467687858-23d96c32e4ae', 'photo-1527443224154-c4a3942d3acf',
  'photo-1504274066654-fa471a65a5bb', 'photo-1491933382434-500287f9b54b', 'photo-1523206489230-c012c64b2b48',
  'photo-1580910051074-3eb694886505', 'photo-1505740420928-5e560c06d30e', 'photo-1498050108023-c5249f4df085',
  'photo-1461747541859-4a413d2946c1', 'photo-1531297484001-80022131f5a1', 'photo-1525547718571-03905c2d6e73',
  'photo-1504384308090-c894fdcc538d', 'photo-1550745165-9bc0b252726f', 'photo-1555680202-c86f0e12f086',
  'photo-1563991655280-cb95c90ca2fb', 'photo-1544006659-f0b21f04cb1d', 'photo-1484704849700-f032a568e944',
  'photo-1546435770-a3e426bf472b', 'photo-1545454675-3531b543bb5b', 'photo-1583394838336-acd977730f8a',
  'photo-1572536147743-659223396697', 'photo-1585333127302-740d1c5b0721', 'photo-1510557880182-3d4d3cba35a5',
  'photo-1551816230-ef5deaed4a26', 'photo-1494438639946-1ebd1d20bf85', 'photo-1524758631624-e2822e304c36',
  'photo-1533090161767-e6ffed986c88', 'photo-1519710164239-da123dc03ef4', 'photo-1540518614846-7eded433c457',
  'photo-1534349762230-e0929b7a4844', 'photo-1583847268964-b28dc2f51ac9', 'photo-1513694203232-719a280e022f',
  'photo-1556911223-e1534ff6fb9b', 'photo-1526170375885-4d8ecf77b99f', 'photo-1517836357463-d25dfeac3438',
  'photo-1515886657613-9f3515b0c78f', 'photo-1491553895911-0055eca6402d', 'photo-1525966222134-fcfa99b8ae77',
  'photo-1560343090-f0409e92791a', 'photo-1572635196237-14b3f281503f', 'photo-1581539250439-c96689b516dd',
  'photo-1586023492125-27b2c045efd7', 'photo-1534349762230-e0929b7a4844', 'photo-1556910103-1c02745aae4d',
  'photo-1594212699903-ec8a3eca50f5', 'photo-1512496015851-a90fb38ba796', 'photo-1590439474822-39c286470877',
  'photo-1517438476312-10d79c67750d', 'photo-1554469384-e58fac16e23a', 'photo-1540189549336-e6e99c3679fe',
  'photo-1518481612222-68bbe828eba1', 'photo-1533228892524-7dec7ece476f', 'photo-1483721310020-03333e577078',
  'photo-1531933355459-4ac9db9403f0'
];

let products = [];
let idCounter = 1;

// 1. Generate 150 Diverse Products
let diverseGenerated = 0;
while (diverseGenerated < 150) {
  for (const [cat, items] of Object.entries(categories)) {
    if (diverseGenerated >= 150) break;
    const itemName = items[diverseGenerated % items.length];
    const brand = ['Aura', 'Nova', 'Luxe', 'Nordic', 'Apex', 'Pure', 'Swift'][diverseGenerated % 7];
    const fullName = `${brand} ${itemName}`;
    
    products.push({
      _id: `prod_${String(idCounter).padStart(3, '0')}`,
      name: fullName,
      description: `Premium ${fullName} designed for modern living. Combines ${cat.toLowerCase()} elegance with high-quality materials and durable construction. Perfect for those who value style and function.`,
      price: Math.round((Math.floor(Math.random() * 450000) + 15000) / 100) * 100,
      offerPrice: Math.round((Math.floor(Math.random() * 350000) + 10000) / 100) * 100,
      image: [getUnsplashUrl(stableIds[idCounter % stableIds.length])],
      category: cat,
      date: Date.now() - (idCounter * 3600000)
    });
    idCounter++;
    diverseGenerated++;
  }
}

// 2. Generate 50 Tech Products
for (let i = 0; i < 50; i++) {
  const base = techProducts[i % techProducts.length];
  const suffix = ['Pro', 'Max', 'Ultra', 'Elite', 'Lite', 'Plus'][Math.floor(i / techProducts.length)];
  const name = suffix ? `${base.name} ${suffix}` : base.name;
  
  products.push({
    _id: `prod_${String(idCounter).padStart(3, '0')}`,
    name: name,
    description: `Cutting-edge ${base.category.toLowerCase()} with high-performance specs. Features the latest technology, sleek design, and exceptional reliability for power users.`,
    price: Math.round((base.price + (Math.random() * 50000)) / 100) * 100,
    offerPrice: Math.round((base.price - (Math.random() * 20000)) / 100) * 100,
    image: [getUnsplashUrl(base.img)],
    category: base.category,
    date: Date.now() - (idCounter * 3600000)
  });
  idCounter++;
}

// Write the final file content
const templatePath = 'c:/Users/ayomi/Downloads/Projects/QuickCart-main/assets/assets.js';
let content = fs.readFileSync(templatePath, 'utf8');

// Find the productsDummyData array and replace it
const startIndex = content.indexOf('export const productsDummyData = [');
const endIndex = content.indexOf('export const addressDummyData = ['); // Assuming it follows

if (startIndex !== -1 && endIndex !== -1) {
  const newArrayStr = `export const productsDummyData = ${JSON.stringify(products, null, 2)}\n\n`;
  const updatedContent = content.substring(0, startIndex) + newArrayStr + content.substring(endIndex);
  fs.writeFileSync(templatePath, updatedContent);
  console.log('Successfully updated assets.js with 200 products.');
} else {
  console.error('Could not find the productsDummyData array in assets.js');
}
