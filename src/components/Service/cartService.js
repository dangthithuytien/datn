import apiClient from "./AxiosConfig";

export const getCartSale = async () => {
  const response = await apiClient.get("/CartSale/get", {
    withCredentials: true
  });
  return response.data;
};

export const addToCartSale = async (productId, quantity = 1) => {
  const response = await apiClient.post("/CartSale/add", { productId, quantity });
  return response.data;
};

export const removeFromCartSale = async (productId) => {
  const response = await apiClient.delete(`/CartSale/remove/${productId}`);
  return response.data;
};

export const increaseQuantity = async (productId) => {
  const response = await apiClient.post(`/CartSale/increase/${productId}`);
  return response.data;
};

export const decreaseQuantity = async (productId) => {
  const response = await apiClient.post(`/CartSale/decrease/${productId}`);
  return response.data;
};

export const clearCartSale = async () => {
  const response = await apiClient.delete(`/CartSale/clear`);
  return response.data;
};
