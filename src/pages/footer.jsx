import React from "react";
import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn, LocationOn, Phone, Email } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "#2E7D32", color: "white", py: 4, px: { xs: 2, md: 6 } }}>
      <Grid container spacing={4} justifyContent="center">
        
        {/* Logo & About */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🌿 Farm Bros
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Delivering fresh and organic fruits and vegetables straight from the farm to your home. We ensure quality, sustainability, and freshness in every order.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" fontWeight="bold">Quick Links</Typography>
          <Box sx={{ mt: 1 }}>
            <Link href="#" underline="none" sx={{ color: "white", display: "block", mb: 1, opacity: 0.9 }}>🏠 Home</Link>
            <Link href="#" underline="none" sx={{ color: "white", display: "block", mb: 1, opacity: 0.9 }}>🛍️ Shop</Link>
            <Link href="#" underline="none" sx={{ color: "white", display: "block", mb: 1, opacity: 0.9 }}>ℹ️ About Us</Link>
            <Link href="#" underline="none" sx={{ color: "white", display: "block", mb: 1, opacity: 0.9 }}>📞 Contact</Link>
          </Box>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" fontWeight="bold">Get In Touch</Typography>
          <Typography variant="body2" sx={{ mt: 1, display: "flex", alignItems: "center", opacity: 0.9 }}>
            <LocationOn sx={{ mr: 1 }} /> 123 Green Farm Road, City, Country
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, display: "flex", alignItems: "center", opacity: 0.9 }}>
            <Phone sx={{ mr: 1 }} /> +91 9876543210
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, display: "flex", alignItems: "center", opacity: 0.9 }}>
            <Email sx={{ mr: 1 }} /> support@farmbros.com
          </Typography>
        </Grid>

      </Grid>

      {/* Social Media Icons */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <IconButton sx={{ color: "white" }}><Facebook /></IconButton>
        <IconButton sx={{ color: "white" }}><Instagram /></IconButton>
        <IconButton sx={{ color: "white" }}><Twitter /></IconButton>
        <IconButton sx={{ color: "white" }}><LinkedIn /></IconButton>
      </Box>

      {/* Copyright */}
      <Box sx={{ textAlign: "center", mt: 3, borderTop: "1px solid #ffffff33", pt: 2 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Farm Bros. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
