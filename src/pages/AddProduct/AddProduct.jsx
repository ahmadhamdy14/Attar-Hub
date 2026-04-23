import { useState } from "react";
import "./AddProduct.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    discount: "", // 👈 جديد
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "products"), {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        discount: Number(form.discount) || 0, // 👈 مهم
        createdAt: new Date(),
      });

      alert("Product added 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>➕ Add Product</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            onChange={handleChange}
          />

          {/* 👇 الجديد */}
          <input
            name="discount"
            placeholder="Discount % (optional)"
            type="number"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;