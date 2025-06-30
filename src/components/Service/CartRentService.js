import axios from "./AxiosConfig";

const CartRentService = {
  async add(rentBookItemId) {
    const response = await axios.post(
      "/CartRent/add",
      { rentBookItemId }, // Gửi đúng dạng object
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },

  async getCart() {
    const response = await axios.get("/CartRent");
    return response.data;
  },

  async remove(bookItemId) {
    const response = await axios.delete(`/CartRent/remove/${bookItemId}`);
    return response.data;
  },

  async clear() {
    await axios.delete("/CartRent/clear");
  },
};

export default CartRentService;
