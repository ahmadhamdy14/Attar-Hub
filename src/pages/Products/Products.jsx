import { useEffect, useState, useContext } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Products.css";

const Products = () => {
  const [Products, setProducts] = useState([]);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));

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

  return (
    <div className="Products">
      <h1>🛍️ Products</h1>

      <div className="Products-grid">

        {/* Products */}
        {Products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.name} />

            <div className="card-body">
              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <div className="card-footer">
                <span className="price">{product.price} EGP</span>
              </div>
            </div>
          </div>
        ))}

        {/* ADD PRODUCT CARD (ADMIN ONLY) */}
        {userData?.role === "admin" && (
          <Link to="/add-product" className="card add-card">
            <div className="card-body add-card-body">
              <h3>Add Product</h3>
              <span className="plus">+</span>
            
            </div>
          </Link>
        )}

      </div>
    </div>
  );
};

export default Products;