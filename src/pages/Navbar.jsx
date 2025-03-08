import { AppBar, Toolbar, IconButton, Badge, Button, Box, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedStoreId");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", px: 3, py: 1, boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo or Brand Name */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer", color: "white" }}
          onClick={() => navigate("/home")}
        >
          FarmBors
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
         
        </Box>

        {/* Cart and Logout Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Cart Icon */}
          <IconButton onClick={() => navigate("/cart")} color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{ fontSize: 28 }} />
            </Badge>
          </IconButton>
          
          {/* Profile Icon */}
          <IconButton onClick={() => navigate("/ProfilePage")} color="inherit">
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
  );
}

export default Navbar;
