import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchStores = async () => {
  const response = await axios.get(`${API_BASE_URL}/stores`);
  return response.data;
};

export const fetchProductsByStore = async (storeId) => {
  const response = await axios.get(`${API_BASE_URL}/products/store/${storeId}/products`);
  return response.data;
};
