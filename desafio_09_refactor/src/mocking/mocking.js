function generateMockProducts() {
    const mockProducts = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 1; i <= 100; i++) {
      const stock = Math.floor(Math.random() * 100) + 1; 
      const code = `${letters.charAt(Math.floor(Math.random() * letters.length))}${Math.floor(Math.random() * 1000)}`; // Código compuesto por una letra y tres números
      mockProducts.push({
        _id: `mock_product_${i}`,
        name: `Mock Product ${i}`,
        price: Math.floor(Math.random() * 10000) + 1, 
        stock: stock,
        code: code,
      });
    }
    return mockProducts;
  }
  
  export default generateMockProducts;
  