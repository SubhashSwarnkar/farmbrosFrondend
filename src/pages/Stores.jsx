import { useEffect, useState } from "react";
import { fetchStores } from "../api";

import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    async function getStores() {
      const data = await fetchStores();
      setStores(data);
    }
    getStores();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Available Stores
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {stores.map((store) => (
          <Grid item key={store._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2, textAlign: "center" }}>
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
    </Box>
  );
}

export default Stores;
