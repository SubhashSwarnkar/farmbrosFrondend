import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Switch,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    profilePicture: "",
    savedAddresses: [],
    notificationPreferences: true,
  });
  
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`https://farmbros-obhk.onrender.com/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(data);
        if (data.location) setLocation(data.location);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, token]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      savedAddresses: [...formData.savedAddresses, { name: "", location: null }],
    });
  };

  const handleLocationSelect = (index, lat, lng) => {
    const updatedAddresses = [...formData.savedAddresses];
    updatedAddresses[index].location = { lat, lng };
    setFormData({ ...formData, savedAddresses: updatedAddresses });
  };

  const LocationMarker = ({ index }) => {
    useMapEvents({
      click(e) {
        handleLocationSelect(index, e.latlng.lat, e.latlng.lng);
      },
    });
    return formData.savedAddresses[index].location ? (
      <Marker position={[formData.savedAddresses[index].location.lat, formData.savedAddresses[index].location.lng]} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://farmbros-obhk.onrender.com/api/auth/profile/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, textAlign: "center", mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">Profile Details</Typography>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleProfilePictureChange} />
        <IconButton onClick={() => fileInputRef.current.click()}>
          <Avatar src={formData.profilePicture} sx={{ width: 80, height: 80 }}>
            <PhotoCameraIcon />
          </Avatar>
        </IconButton>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>Saved Addresses</Typography>
          {formData.savedAddresses.map((address, index) => (
            <Paper key={index} sx={{ p: 2, mt: 2 }}>
              <TextField fullWidth label="Address Name" value={address.name} onChange={(e) => {
                const updatedAddresses = [...formData.savedAddresses];
                updatedAddresses[index].name = e.target.value;
                setFormData({ ...formData, savedAddresses: updatedAddresses });
              }} />
              <div style={{ height: "200px", marginTop: "10px" }}>
                <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker index={index} />
                </MapContainer>
              </div>
              <IconButton onClick={() => {
                setFormData({ ...formData, savedAddresses: formData.savedAddresses.filter((_, i) => i !== index) });
              }}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}

          <Button onClick={handleAddAddress} variant="outlined" sx={{ mt: 2 }}>Add Address</Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Save Changes</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
