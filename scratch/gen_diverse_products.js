const ids = [
  "photo-1523381210434-271e8be1f52b", "photo-1542291026-7eec264c27ff", "photo-1595341888016-a392ef81b7de",
  "photo-1584917865442-de89df76afd3", "photo-1522335789203-aabd1fc54bc9", "photo-1540555700478-4be289fbecee",
  "photo-1583847268964-b28dc2f51ac9", "photo-1513694203232-719a280e022f", "photo-1556911223-e1534ff6fb9b",
  "photo-1526170375885-4d8ecf77b99f", "photo-1517836357463-d25dfeac3438", "photo-1515886657613-9f3515b0c78f",
  "photo-1491553895911-0055eca6402d", "photo-1525966222134-fcfa99b8ae77", "photo-1560343090-f0409e92791a",
  "photo-1572635196237-14b3f281503f", "photo-1581539250439-c96689b516dd", "photo-1586023492125-27b2c045efd7",
  "photo-1534349762230-e0929b7a4844", "photo-1556910103-1c02745aae4d", "photo-1594212699903-ec8a3eca50f5",
  "photo-1512496015851-a90fb38ba796", "photo-1590439474822-39c286470877", "photo-1517438476312-10d79c67750d",
  "photo-1554469384-e58fac16e23a", "photo-1540189549336-e6e99c3679fe", "photo-1518481612222-68bbe828eba1",
  "photo-1533228892524-7dec7ece476f", "photo-1483721310020-03333e577078", "photo-1531933355459-4ac9db9403f0"
];

const categories = ["Fashion", "Home Decor", "Kitchen", "Beauty", "Fitness", "Furniture"];

const products = ids.map((id, index) => {
  const cat = categories[index % categories.length];
  const realIndex = index + 61;
  return {
    _id: `prod_${String(realIndex).padStart(3, '0')}`,
    name: `${cat} Essential ${String(realIndex).padStart(3, '0')}`,
    description: `A premium selection from our ${cat.toLowerCase()} collection. Designed for style, comfort, and durability. This item represents the best in modern lifestyle products, blending form and function seamlessly.`,
    price: Math.floor(Math.random() * 500000) + 5000,
    offerPrice: Math.floor(Math.random() * 400000) + 4000,
    image: [`https://images.unsplash.com/${id}?q=80&w=1000&auto=format&fit=crop`],
    category: cat,
    date: Date.now() - (realIndex * 86400000)
  };
});

console.log(JSON.stringify(products, null, 2).slice(1, -1)); // Remove outer brackets for easier appending
