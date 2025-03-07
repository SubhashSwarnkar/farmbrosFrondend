import { AppBar, Toolbar, IconButton, Badge, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");         // Remove auth token
    localStorage.removeItem("userId");        // Remove user ID
    localStorage.removeItem("selectedStoreId"); // Remove selected store ID
  
    navigate("/"); // Redirect to login page
  };
  

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left Section - Logo (if needed) */}
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
        </Box>

        {/* Right Section - Cart & Logout */}
        <Box>
          {/* Cart Icon */}
          <IconButton onClick={() => navigate("/cart")} color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate("/ProfilePage")}>ProfilePage</Button>
        </Box>
          {/* Logout Button */}
          <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
