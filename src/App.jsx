import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import FavoritesProvider from "./context/FavoritesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;