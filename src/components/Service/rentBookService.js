import apiClient from "./AxiosConfig";

const RENT_BOOK_ENDPOINT = "/RentBooks";
const RENT_BOOK_ITEM_ENDPOINT = "/RentBookItem";

export const getAllRentBooks = async () => {
  const response = await apiClient.get(RENT_BOOK_ENDPOINT);
  return response.data;
};

export const getRentBookById = async (id) => {
  const response = await apiClient.get(`${RENT_BOOK_ENDPOINT}/${id}`);
  return response.data;
};

export const getAllRentBookItems = async () => {
  const response = await apiClient.get(RENT_BOOK_ITEM_ENDPOINT);
  return response.data;
};