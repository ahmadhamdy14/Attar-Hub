import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Admin from "../pages/Admin/Admin";
import Products from "../pages/Products/Products";
import AddProduct from "../pages/AddProduct/AddProduct";
import Cart from "../pages/Cart/Cart";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
        
          {/* 🔐 Protected Route */}
          <Route path="/" element={<ProtectedRoute> <Products /> </ProtectedRoute>}/>
          <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>}/>
          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProtectedRoute> <Products /> </ProtectedRoute>}/>
          
          {/* 🚫 Admin Only Route */} 
          <Route path="/admin" element={<AdminRoute> <Admin /> </AdminRoute>}/>
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;