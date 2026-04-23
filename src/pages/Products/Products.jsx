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
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [clickedId, setClickedId] = useState(null);

  const { userData } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

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
      <h1>🛍️ Products</h1>

      {/* 🔍 Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📦 Grid */}
      <div className="products-grid">
        {products
          .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => {
            // 💰 حساب السعر بعد الخصم
            const finalPrice =
              product.price -
              (product.price * (product.discount || 0)) / 100;

            return (
              <div className="card" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="card-body">
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

                  {/* 🛒 ADD */}
                  <button
                    className={`add-btn ${
                      clickedId === product.id ? "added" : ""
                    }`}
                    onClick={() => {
                      addToCart(product);
                      setClickedId(product.id);
                      setTimeout(() => setClickedId(null), 1000);
                    }}
                  >
                    {clickedId === product.id
                      ? "✔ Added!"
                      : "Add to Cart"}
                  </button>

                  {/* ❌ DELETE (Admin only) */}
                  {userData?.role === "admin" && (
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteClick(product.id)
                      }
                    >
                      Delete
                    </button>
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
              <h3>Add Product</h3>
            </div>
          </Link>
        )}
      </div>

      {/* ⚠️ Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete?</h3>

            <div className="modal-actions">
              <button
                className="yes-btn"
                onClick={confirmDelete}
              >
                Yes
              </button>

              <button
                className="no-btn"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;