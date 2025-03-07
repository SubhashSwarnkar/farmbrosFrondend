import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchCart, 
  getCartItems, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} from "../redux/cartSlice";
import { 
  Box, Typography, Button, Grid, Card, CardContent, IconButton, CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(getCartItems);
  const status = useSelector((state) => state.cart.status);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Get user ID from local storage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Increase Quantity
  const handleIncreaseQuantity = async (item) => {
    await dispatch(updateCartQuantity({ id: item._id, quantity: item.quantity + 1 }));
    dispatch(fetchCart(userId));  // Fetch updated cart
  };

  // Decrease Quantity
  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 0.25) {
      await dispatch(updateCartQuantity({ id: item._id, quantity: item.quantity - 1}));
      dispatch(fetchCart(userId));  // Fetch updated cart
    }
  };

  // Remove Item
  const handleRemoveItem = async (id) => {
    await dispatch(removeFromCart(id));
    dispatch(fetchCart(userId));  // Fetch updated cart
  };

  // Clear Cart
  const handleClearCart = async () => {
    await dispatch(clearCart(userId));
    dispatch(fetchCart(userId));  // Fetch updated cart
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Shopping Cart
      </Typography>

      {status === "loading" ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : cartItems.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.productId.name}</Typography>

                    {/* Display Quantity */}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Quantity: {item.quantity} kg
                    </Typography>

                    {/* Quantity Control Buttons */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <IconButton onClick={() => handleDecreaseQuantity(item)} color="primary" size="small">
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2 }}>
                        {item.quantity} kg
                      </Typography>
                      <IconButton onClick={() => handleIncreaseQuantity(item)} color="primary" size="small">
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Total: ₹{item.price * item.quantity}
                    </Typography>
                  </CardContent>

                  {/* Remove Button */}
                  <IconButton onClick={() => handleRemoveItem(item._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Total Price & Checkout */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h5">Total Price: ₹{totalPrice}</Typography>
            <Button variant="contained" color="error" sx={{ mt: 2, mr: 2 }} onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Cart;
