const ids = [
  "photo-1505740420928-5e560c06d30e", "photo-1523275335684-37898b6baf30", "photo-1583394838336-acd977736f90",
  "photo-1491933382434-500287f9b54b", "photo-1525547719571-a2d4ac8945e2", "photo-1511707171634-5f897ff02aa9",
  "photo-1542435503-956c469947f6", "photo-1527698266440-12104e498b76", "photo-1600003014795-8114676355d8",
  "photo-1593359677879-a4bb92f829d1", "photo-1550009158-9ebf69173e03", "photo-1591405351990-4726e331f141",
  "photo-1611186871348-b1ec696e52c9", "photo-1610633058829-103c73406533", "photo-1544244015-0df4b3ffc6b0",
  "photo-1615663245857-ac93bb7c39e7", "photo-1510127034890-ba27508e9f1c", "photo-1593642632823-8f785ba67e45",
  "photo-1517336714731-489689fd1ca8", "photo-1516035069371-29a1b244cc32", "photo-1590658268037-6bf12165a8df",
  "photo-1535016120720-40c646bebbfc", "photo-1496181133206-80ce9b88a853", "photo-1696446701796-da61225697cc",
  "photo-1434494878577-86c23bcb06b9", "photo-1516724562728-afc824a36e84", "photo-1511467687858-23d96c32e4ae",
  "photo-1504274066651-8d31a536b11a", "photo-1498050108023-c5249f4df085", "photo-1555066931-4365d14bab8c",
  "photo-1550745165-9bc0b252726f", "photo-1519389950473-47ba0277781c", "photo-1460925895917-afdab827c52f",
  "photo-1526738549149-8e07eca6c147", "photo-1589003077984-894e133dabab", "photo-1547115941-bc8744445811",
  "photo-1563906267088-b029e7101114", "photo-1551645120-d70bfe84ca82", "photo-1515343483120-f49958397a57",
  "photo-1525547719571-a2d4ac8945e2", "photo-1531297484001-80022131f5a1", "photo-1485827404703-89b55fcc595e",
  "photo-1504890005393-2035a301a039", "photo-1550009158-9ebf69173e03", "photo-1616763355548-1b606f439f86",
  "photo-1624701928517-44c8ac49d93c", "photo-1591405351990-4726e331f141", "photo-1544006659-f0b21f04cb1d",
  "photo-1611186871348-b1ec696e52c9", "photo-1603302576837-37561b2e2302", "photo-1563991655280-cb95c90ca2fb",
  "photo-1558885544-2defc62e2e2b", "photo-1518770660439-4636190af475", "photo-1520110120385-c285d6b23b7d",
  "photo-1507646227570-57e27c14d9a5", "photo-1551817958-c1993e114d73", "photo-1519211975560-4ca611f5a72a",
  "photo-1526509867162-5b0c0d1b4b33", "photo-1551728598-1395c9ca6ad8", "photo-1542744094-24638eff58bb"
];

const categories = ["Earphone", "Headphone", "Smartphone", "Watch", "Accessories", "Camera", "Laptop"];

const products = ids.map((id, index) => {
  const cat = categories[index % categories.length];
  return {
    _id: `prod_${String(index + 1).padStart(3, '0')}`,
    name: `${cat} Model ${String(index + 1).padStart(3, '0')}`,
    description: `High-quality ${cat.toLowerCase()} featuring advanced technology, ergonomic design, and premium materials. Perfect for daily use and professional workflows. Includes latest features and a sleek aesthetic.`,
    price: Math.floor(Math.random() * 2000000) + 100000,
    offerPrice: Math.floor(Math.random() * 1500000) + 50000,
    image: [`https://images.unsplash.com/${id}?q=80&w=1000&auto=format&fit=crop`],
    category: cat,
    date: Date.now() - (index * 86400000)
  };
});

console.log(JSON.stringify(products, null, 2));
