import { useState } from "react";
import "./AddProduct.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    discount: "",
    category: "",
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
      toast.warning("Please fill in the required information");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "products"), {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        category: form.category ? form.category.trim() : "متنوع",
        discount: Number(form.discount) || 0,
        createdAt: new Date(),
      });

      toast.success("Product added successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Product added failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2> add new product ➕</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product name"
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
            placeholder="Discount %"
            type="number"
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
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