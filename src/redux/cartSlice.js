import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/cart";
// Add to cart API call
export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  const response = await axios.post("http://localhost:5000/api/cart/add", product);
  return response.data;
});

// Fetch cart from API
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await axios.get(`${API_BASE_URL}?userId=${userId}`);
  return response.data;
});

// Update quantity of an item in the cart (API Call)
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ id, quantity }) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, { quantity });
    return response.data;
  }
);

// Remove an item from the cart (API Call)
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (id) => {
  await axios.delete(`${API_BASE_URL}/remove/${id}`);
  return id; // Return ID to remove it from the Redux state
});

// Clear the entire cart (API Call)
export const clearCart = createAsyncThunk("cart/clearCart", async (userId) => {
  await axios.delete(`${API_BASE_URL}/clear?userId=${userId}`);
  return [];
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(addToCart.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    })
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update quantity in Redux after API success
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { _id, quantity } = action.payload;
        const item = state.items.find((item) => item._id === _id);
        if (item) {
          item.quantity = quantity;
          state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
      })

      // Remove item from Redux state after API success
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      })

      // Clear cart after API success
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
      });
  },
});

export const getCartItems = (state) => state.cart.items;
export const getCartStatus = (state) => state.cart.status;
export default cartSlice.reducer;
