import { useEffect, useState, useContext } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [clickedId, setClickedId] = useState(null);
  const { userData } = useContext(AuthContext);
  const { cart, addToCart, decreaseQty } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 📦 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  // ❌ Delete Logic
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "products", selectedId));

      setProducts(products.filter((p) => p.id !== selectedId));

      setShowModal(false);
      setSelectedId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="products">
      <h1>المنتجات </h1>

      {/* 🔍 Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🏷️ Categories */}
      <div className="categories-filter">
        {["الكل", ...new Set(products.map(p => p.category || "متنوع"))].map((cat, index) => (
          <button
            key={index}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Grid */}
      <div className="products-grid">
        {products
          .filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description?.toLowerCase().includes(search.toLowerCase());
            const matchCategory = selectedCategory === "الكل" || (p.category || "متنوع") === selectedCategory;
            return matchSearch && matchCategory;
          })
          .map((product) => {
            const cartItem = cart.find((c) => c.id === product.id);

            // 💰 حساب السعر بعد الخصم
            const finalPrice =
              product.price -
              (product.price * (product.discount || 0)) / 100;

            return (
              <div className="card" key={product.id}>
                {/* Heart Icon Toggle */}
                <button
                  className="heart-btn"
                  onClick={() => toggleFavorite(product)}
                >
                  {isFavorite(product.id) ? "❤️" : "🤍"}
                </button>

                <img src={product.image} alt={product.name} />

                <div className="card-body">
                  <span className="category-badge">{product.category || "متنوع"}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  {/* 💰 PRICE BOX */}
                  <div className="price-box">
                    {product.discount > 0 && (
                      <span className="old-price">
                        {product.price} EGP
                      </span>
                    )}
                    <div>
                      <span className="new-price">
                        {finalPrice.toFixed(0)} EGP
                      </span>

                      {product.discount > 0 && (
                        <span className="badge">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 🛒 ADD / QTY BOX */}
                  {cartItem ? (
                    <div className="qty-box">
                      <button onClick={() => decreaseQty(product.id)}>-</button>
                      <span>{cartItem.qty}</span>
                      <button onClick={() => addToCart(product)}>+</button>
                    </div>
                  ) : (
                    <button
                      className={`add-btn ${clickedId === product.id ? "added" : ""
                        }`}
                      onClick={() => {
                        addToCart(product);
                        setClickedId(product.id);
                        setTimeout(() => setClickedId(null), 1000);
                      }}
                    >
                      {clickedId === product.id
                        ? "✔ تمت الإضافة!"
                        : "إضافة للسلة"}
                    </button>
                  )}

                  {/* ❌ DELETE & EDIT (Admin only) */}
                  {userData?.role === "admin" && (
                    <div className="admin-actions">
                      <Link to={`/edit-product/${product.id}`} className="edit-btn">
                        ✏️ تعديل
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteClick(product.id)
                        }
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* ➕ Add Product */}
        {userData?.role === "admin" && (
          <Link to="/add-product" className="card add-card">
            <div className="card-body add-card-body">
              <span className="plus">+</span>
              <h3>إضافة منتج</h3>
            </div>
          </Link>
        )}
      </div>

      {/* ⚠️ Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>هل أنت متأكد من حذف هذا المنتج؟</h3>

            <div className="modal-actions">
              <button
                className="yes-btn"
                onClick={confirmDelete}
              >
                نعم
              </button>

              <button
                className="no-btn"
                onClick={cancelDelete}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;