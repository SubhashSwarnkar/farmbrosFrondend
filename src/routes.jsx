import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Stores from "./pages/Stores";
import ProfilePage from "./pages/ProfilePage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
