import { createContext, useState, useEffect, useContext, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const isLoadedRef = useRef(false); // prevent writing before first load

  // 🔥 Load favorites from Firestore when user logs in
  useEffect(() => {
    if (user) {
      isLoadedRef.current = false;
      const ref = doc(db, "users", user.uid);
      getDoc(ref).then((snap) => {
        if (snap.exists() && snap.data().favorites) {
          setFavorites(snap.data().favorites);
        } else {
          setFavorites([]);
        }
        isLoadedRef.current = true;
      });
    } else {
      setFavorites([]);
      isLoadedRef.current = false;
    }
  }, [user]);

  // 🔥 Save favorites to Firestore whenever they change (after load)
  useEffect(() => {
    if (!user || !isLoadedRef.current) return;

    const ref = doc(db, "users", user.uid);
    setDoc(ref, { favorites }, { merge: true });
  }, [favorites, user]);

  const toggleFavorite = (product) => {
    const isFav = favorites.find((item) => item.id === product.id);
    if (isFav) {
      setFavorites(favorites.filter((item) => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
