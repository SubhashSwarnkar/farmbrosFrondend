import { useState, useEffect } from "react";
import { 
  Tabs, Tab, Box, Grid, Card, CardContent, Typography, 
  CardMedia, Button, TextField, Skeleton, Select, MenuItem, 
  Snackbar, Alert
} from "@mui/material";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

function Products({ storeId }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState({}); 

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!storeId) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/store/${storeId}/categories-products`);
        const allProductsList = response.data.flatMap((cat) => cat.products);
        setAllProducts(allProductsList);
        setCategories(response.data.map((cat) => cat.category));
        setProductsByCategory(
          response.data.reduce((acc, cat) => {
            acc[cat.category] = cat.products;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [storeId]);


  const filteredProducts = selectedCategory === "All Products"
  ? allProducts
  : productsByCategory[selectedCategory] || [];

const searchFilteredProducts = filteredProducts.filter((product) =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleAddToCart = async (product) => {
  if (!product || !product._id) {
    console.error("Invalid product data:", product);
    return;
  }

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("User ID not found in local storage");
    return;
  }

  const selected = selectedQuantities[product._id];
  if (!selected) {
    console.error("No quantity selected for product:", product.name);
    return;
  }

  const cartItem = {
    userId, // Now it's properly retrieved
    productId: product._id,
    quantity: selected.quantity,
    price: selected.price,
  };

  try {
    const response = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    const data = await response.json();
    console.log("Cart updated:", data);

    // Dispatch Redux action if needed
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: selected.price,
      quantity: selected.quantity,
    }));

    // Show success message
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  } catch (error) {
    console.error("Error adding to cart:", error);
    setSnackbarMessage("Failed to add item to cart");
    setSnackbarOpen(true);
  }
};



  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Products
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Products" value="All Products" />
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 400 }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Grid>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product._id} xs={6} sm={6} md={3}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: "center", transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                {product.image && (
                  <CardMedia
                    component="img"
                    height="auto"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: "cover", loading: "lazy" }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>

                  <Select
                    value={selectedQuantities[product._id]?.id || ""}
                    onChange={(e) => {
                      const selected = product.quantities.find((q) => q._id === e.target.value);
                      setSelectedQuantities((prev) => ({
                        ...prev,
                        [product._id]: selected,
                      }));
                    }}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {product.quantities.map((q) => (
                      <MenuItem key={q._id} value={q._id}>
                        {q.quantity} kg - ₹{q.price}
                      </MenuItem>
                    ))}
                  </Select>

                  {selectedQuantities[product._id] && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Selected: {selectedQuantities[product._id].quantity} kg - ₹{selectedQuantities[product._id].price}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 1 }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography align="center" sx={{ width: "100%", mt: 2 }}>
            No products available in this category.
          </Typography>
        )}
      </Grid>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Products;
