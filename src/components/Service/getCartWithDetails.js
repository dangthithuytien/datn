export const getCartWithDetails = async () => {
    const cartItems = await getCartSale();
  
    const cartWithDetails = cartItems.map((item) => {
      const cached = JSON.parse(localStorage.getItem(`book-${item.productId}`)) || {};
      return {
        ...item,
        title: cached.title || "(không rõ tên)",
        image: cached.image || "/placeholder.jpg"
      };
    });
  
    return cartWithDetails;
  };