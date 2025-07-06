import axios from "./AxiosConfig";

export const addToRentCart = async (rentBookItemId) => {
  const response = await axios.post("/CartRent/addrent", rentBookItemId, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(">>> Thêm giỏ thuê thành công:", response.data);
  return response.data;
};

export const getCartRent = async () => {
  const response = await axios.get("/CartRent", {
    withCredentials: true,
  });
  console.log(">> API /CartRent response:", response.data);
  return response.data;
};

export const removeFromCartRent = async (bookItemId) => {
  const response = await axios.delete(`/CartRent/removerent/${bookItemId}`);
  return response.data;
};

export const clearCartRent = async () => {
  await axios.delete("/CartRent/clearrent");
};

export const getRentCartWithDetails = async () => {
  const rentItems = await getCartRent();

  const rentCartWithDetails = rentItems.map((item) => {
    const cached = JSON.parse(localStorage.getItem(`rentBook-${item.RentBookItemId}`)) || {};
    return {
      ...item,
      title: cached.title || "(không rõ tên)",
      image: cached.image || "/placeholder.jpg",
    };
  });

  return rentCartWithDetails;
};