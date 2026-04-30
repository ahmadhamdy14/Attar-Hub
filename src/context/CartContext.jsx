import { createContext, useState, useEffect, useContext, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const isLoadedRef = useRef(false); // prevent writing before first load

  // 🔥 Load cart from Firestore when user logs in
  useEffect(() => {
    if (user) {
      isLoadedRef.current = false;
      const ref = doc(db, "users", user.uid);
      getDoc(ref).then((snap) => {
        if (snap.exists() && snap.data().cart) {
          setCart(snap.data().cart);
        } else {
          setCart([]);
        }
        isLoadedRef.current = true;
      });
    } else {
      setCart([]);
      isLoadedRef.current = false;
    }
  }, [user]);

  // 🔥 Save cart to Firestore whenever it changes (after load)
  useEffect(() => {
    if (!user || !isLoadedRef.current) return;

    const ref = doc(db, "users", user.uid);
    setDoc(ref, { cart }, { merge: true });
  }, [cart, user]);

  // ➕ Add to cart
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ➖ Decrease qty
  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 🧹 Clear cart
  const clearCart = () => setCart([]);

  // 🔢 Cart count
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;