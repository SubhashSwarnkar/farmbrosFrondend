import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Products from "./Products";
import axios from "axios";
import Navbar from "./Navbar";

function Home() {
  const [open, setOpen] = useState(!localStorage.getItem("selectedStoreId")); // Open dialog if no store is selected
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(localStorage.getItem("selectedStoreId") || null);

  // Fetch stores from API
  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await axios.get("https://farmbros-obhk.onrender.com/api/stores");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    }
    fetchStores();
  }, []);

  // Handle store selection
  const handleStoreSelect = (storeId) => {
    localStorage.setItem("selectedStoreId", storeId); // Save store ID
    setSelectedStore(storeId);
    setOpen(false); // Close the dialog
  };

  return (
    <Box sx={{ p: 4 }}>
      <Navbar />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Welcome to FarmBors</Typography>
      </Box>

      {/* Store Selection Dialog */}
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle align="center">Select a Store</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} justifyContent="center">
            {stores.map((store) => (
              <Grid item key={store._id} xs={12} sm={6}>
                <Card
                  sx={{ boxShadow: 3, borderRadius: 2, textAlign: "center", cursor: "pointer" }}
                  onClick={() => handleStoreSelect(store._id)}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {store.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {store.city}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Show Products after Store Selection */}
      {selectedStore && <Products storeId={selectedStore} />}
    </Box>
  );
}

export default Home;
