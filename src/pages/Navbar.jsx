import { useState } from "react";
import { 
  AppBar, Toolbar, IconButton, Drawer, Badge, Button, Box, Typography, Divider 
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import ProfilePage from "./ProfilePage";

function Navbar() {
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const navigate = useNavigate();
 
  const [cartOpen, setCartOpen] = useState(false); // Cart Drawer State
  const [profileOpen, setProfileOpen] = useState(false); // Profile Drawer State

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedStoreId");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#228B22", px: 3, py: 1, boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer", color: "white" }}
            onClick={() => navigate("/home")}
          >
            FarmBors
          </Typography>

          {/* Right Side Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Cart Icon with Drawer */}
            
            <IconButton onClick={() => setCartOpen(true)} color="inherit">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>

            {/* Profile Icon with Drawer */}
            <IconButton onClick={() => setProfileOpen(true)} color="inherit">
              <AccountCircleIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Logout Button */}
            <Button
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <Divider sx={{ my: 1 }} />

          {/* Cart Items (Replace with dynamic content) */}
          <Box sx={{ mt: 2 }}>
        <Cart/>
          </Box>

          {/* Close Button */}
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setCartOpen(false)}>
            Close Cart
          </Button>
        </Box>
      </Drawer>

      {/* Profile Drawer */}
      <Drawer anchor="right" open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6">Profile</Typography>
          <Divider sx={{ my: 1 }} />

          {/* Profile Details (Replace with actual user data) */}
          <Box sx={{ mt: 2 }}>
           <ProfilePage/>
          </Box>

          {/* Profile Actions */}
         

          {/* Close Button */}
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => setProfileOpen(false)}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
