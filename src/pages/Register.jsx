import { useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from "@mui/material";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
      });
      console.log(res.data);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 5, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            margin="normal"
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
