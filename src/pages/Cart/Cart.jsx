import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 📱 WhatsApp business number (without + or spaces)
const WHATSAPP_NUMBER = "201069199985";

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart, decreaseQty } =
    useContext(CartContext);
  const { user, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: user?.email || "",
    phone: userData?.phone || "",
    address: "",
  });

  // Subtotal after discount
  const subtotal = cart.reduce((acc, item) => {
    const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return acc + finalPrice * item.qty;
  }, 0);

  const DELIVERY_FEE = 10;
  const total = subtotal + DELIVERY_FEE;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppMessage = (orderId, items) => {
    let msg = `🛒 *new order* 🎉\n`;
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `👤 Name: ${form.firstName} ${form.lastName}\n`;
    msg += `📞 phone: ${form.phone}\n`;
    msg += `📍 Address: ${form.address}\n`;
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `📦 *products:*\n`;

    items.forEach((item, i) => {
      const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
      msg += `\n${i + 1}. ${item.name}\n`;
      msg += `   quantity: ${item.qty}\n`;
    });

    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `thank you! ❤️`;

    return encodeURIComponent(msg);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        discount: item.discount || 0,
        image: item.image,
      }));

      const orderId = await createOrder({
        userId: user.uid,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        items,
        totalPrice: parseFloat(total.toFixed(2)),
      });

      // ✅ Open WhatsApp with full order details
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(orderId, items)}`;
      window.open(waUrl, "_blank");

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>cart</h1>

      {cart.length === 0 ? (
        <div className="empty-box">
          <h2> cart is empty 😢 </h2>
          <br />
          <Link to="/products" className="browse-btn">
            go to shop
          </Link>
        </div>
      ) : (
        <div className="cart-wrapper">

          {/* 🧾 ITEMS */}
          <div className="cart-items">
            {cart.map((item) => {
              const finalPrice =
                item.price - (item.price * (item.discount || 0)) / 100;
              return (
                <div className="cart-card" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>{finalPrice.toFixed(0)} EGP</p>

                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✖
                  </button>
                </div>
              );
            })}
            <Link to="/products" className="browse-btn">
              go to shop
            </Link>
          </div>

          {/* 💰 SUMMARY */}
          <div className="cart-summary">
            <h2>order summary</h2>

            <div className="summary-row">
              <span>order price</span>
              <span>{subtotal.toFixed(0)} EGP</span>
            </div>

            <div className="summary-row">
              <span> delivery fees 🚚</span>
              <span>10 EGP</span>
            </div>

            <div className="summary-row total-row">
              <span>total</span>
              <span>{total.toFixed(0)} EGP</span>
            </div>

            {!showForm ? (
              <button
                className="checkout-btn"
                onClick={() => setShowForm(true)}
              >
                place order 🚀
              </button>
            ) : (
              <form className="checkout-form" onSubmit={handlePlaceOrder}>
                <h3>customer info</h3>

                <div className="form-row">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="first name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={loading}
                >
                  {loading ? "placing order.." : "place order ✅"}
                </button>

                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setShowForm(false)}
                >
                  cancel
                </button>
              </form>
            )}

            {!showForm && (
              <button className="clear-btn" onClick={clearCart}>
                clear cart 🧹
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;