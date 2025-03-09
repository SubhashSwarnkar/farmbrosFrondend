import { useState, useEffect } from "react";
import { 
  Tabs, Tab, Box, Grid, Card, CardContent, Typography, 
  CardMedia, Button, TextField, Skeleton, Select, MenuItem, 
  Snackbar, Alert, Divider
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!storeId) return;
      try {
        setLoading(true);
        const response = await axios.get(`https://farmbros-obhk.onrender.com/api/products/store/${storeId}/categories-products`);
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
    if (!product || !product._id) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    
    const selected = selectedQuantities[product._id] || product.quantities[0];
    if (!selected) return;

    const cartItem = {
      userId,
      productId: product._id,
      quantity: selected.quantity,
      price: selected.price,
    };

    try {
      await axios.post("https://farmbros-obhk.onrender.com/api/cart/add", cartItem);
      dispatch(addToCart({ id: product._id, name: product.name, price: selected.price, quantity: selected.quantity }));
      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to add item to cart");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Browse Products
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 400 }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="All Products" value="All Products" />
        {categories.map((category) => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Grid>
          ))
        ) : searchFilteredProducts.length > 0 ? (
          searchFilteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={3}>
              <Card  sx={{ boxShadow: 3, borderRadius: 2, textAlign: "center", transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="secondary">
                    ₹{product.quantities[0]?.price} / 1kg
                  </Typography>
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
