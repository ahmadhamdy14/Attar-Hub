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

  // 🧨 MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🔥 fetch products
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

  // 🧨 OPEN MODAL
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
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

  // ❌ CANCEL DELETE
  const cancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="products">
      <h1>🛍️ Products</h1>

      {/* 🔍 SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-grid">

        {/* PRODUCTS */}
        {products
          .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => (
            <div className="card" key={product.id}>
              <img src={product.image} alt={product.name} />

              <div className="card-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <span className="price">
                  {product.price} EGP
                </span>

                {/* 🛒 ADD TO CART */}
                <button
                  className={`add-btn ${
                    clickedId === product.id ? "added" : ""
                  }`}
                  onClick={() => {
                    addToCart(product);
                    setClickedId(product.id);
                    setTimeout(() => setClickedId(null), 800);
                  }}
                >
                  {clickedId === product.id
                    ? "✔ Added"
                    : "Add to Cart"}
                </button>

                {/* 🧨 DELETE (ADMIN ONLY) */}
                {userData?.role === "admin" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

        {/* 👑 ADD PRODUCT */}
        {userData?.role === "admin" && (
          <Link to="/add-product" className="card add-card">
            <div className="card-body add-card-body">
              <span className="plus">+</span>
              <h3>Add Product</h3>
            </div>
          </Link>
        )}
      </div>

      {/* 🧨 MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete?</h3>

            <div className="modal-actions">
              <button className="yes-btn" onClick={confirmDelete}>
                Yes
              </button>

              <button className="no-btn" onClick={cancelDelete}>
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