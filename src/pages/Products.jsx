import { useState, useEffect, useRef } from "react";
import { 
  Box, Card, CardContent, Typography, CardMedia, 
  Button, TextField, Snackbar, Alert, Divider, Container, IconButton, useMediaQuery 
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import Banners from "./Banners";
import Footer from "./footer";

function Products({ storeId }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const scrollRefs = useRef({});
  
  // Media Query for Responsive Behavior
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!storeId) return;
      try {
        setLoading(true);
        const response = await axios.get(`https://farmbros-obhk.onrender.com/api/products/store/${storeId}/categories-products`);
        const allProductsList = response.data.flatMap((cat) => cat.products);
        setAllProducts(allProductsList);
        setCategories(["All Products", ...response.data.map((cat) => cat.category)]);
        setProductsByCategory({
          "All Products": allProductsList,
          ...response.data.reduce((acc, cat) => {
            acc[cat.category] = cat.products;
            return acc;
          }, {})
        });
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [storeId]);

  const handleAddToCart = async (product) => {
    if (!product || !product._id) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.post("https://farmbros-obhk.onrender.com/api/cart/add", {
        userId,
        productId: product._id,
        quantity: product.quantities[0]?.quantity || 1,
        price: product.quantities[0]?.price || 0,
      });

      dispatch(addToCart({
        id: product._id,
        name: product.name,
        price: product.quantities[0]?.price || 0,
        quantity: product.quantities[0]?.quantity || 1
      }));

      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to add item to cart");
      setSnackbarOpen(true);
    }
  };

  const scrollLeft = (category) => {
    if (scrollRefs.current[category]) {
      scrollRefs.current[category].scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = (category) => {
    if (scrollRefs.current[category]) {
      scrollRefs.current[category].scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  return (
    <Container sx={{ p: 4 }}>
      <Box><Banners /></Box>
    
      {/* Search Box */}
      <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 400 }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Product Listing with Horizontal Scroll */}
      {loading ? (
        Array.from(new Array(3)).map((_, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Loading...
            </Typography>
            <Box sx={{ display: "flex", overflowX: "auto", gap: 2, p: 1 }}>
              {Array.from(new Array(4)).map((_, i) => (
                <Card key={i} sx={{ width: 200, height: 250, bgcolor: "#f0f0f0" }} />
              ))}
            </Box>
          </Box>
        ))
      ) : (
        categories.map((category) => {
          const filteredProducts = (productsByCategory[category] || []).filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <Box key={category} sx={{ mb: 4, position: "relative" }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                {category}
              </Typography>

              {/* Scroll Buttons (Hidden on Mobile) */}
              {!isMobile && (
                <IconButton
                  sx={{ position: "absolute", top: "50%", left: -10, zIndex: 2, transform: "translateY(-50%)", bgcolor: "white", boxShadow: 3 }}
                  onClick={() => scrollLeft(category)}
                >
                  <ArrowBackIos />
                </IconButton>
              )}

              <Box
                ref={(el) => (scrollRefs.current[category] = el)}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 2,
                  p: 1,
                  scrollbarWidth: "none",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" }
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Card 
                      key={product._id}
                      sx={{
                        minWidth: 180,
                        maxWidth: 220,
                        boxShadow: 3,
                        borderRadius: 2,
                        textAlign: "center",
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.05)" }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
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
                    
                  ))
                ) : (
                  <Typography sx={{ width: "100%", mt: 2 }}>
                    No products available in this category.
                  </Typography>
                )}
              </Box>

              {!isMobile && (
                <IconButton
                  sx={{ position: "absolute", top: "50%", right: -10, zIndex: 2, transform: "translateY(-50%)", bgcolor: "white", boxShadow: 3 }}
                  onClick={() => scrollRight(category)}
                >
                  <ArrowForwardIos />
                </IconButton>
              )}
            </Box>
          );
        })
      )}

      {/* Snackbar Notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>{snackbarMessage}</Alert>
      </Snackbar>
      <Box><Footer/></Box>
    </Container>
    
  );
}

export default Products;
