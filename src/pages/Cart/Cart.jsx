import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const phoneNumber = "201069199985"; // 🔥 حط رقمك هنا (مصر: 20 + الرقم بدون 0)

const handleCheckout = () => {
  if (cart.length === 0) return;

  let message = "🛒 New Order:\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}) ${item.name}
Qty: ${item.qty}
Price: ${item.price} EGP
-------------------\n`;
  });

  message += `\n💰 Total: ${total} EGP`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  clearCart(); // 🧨 تفريغ السلة بعد الإرسال
};

  return (
    <div className="cart-container">
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty">Your cart is empty</p>
      ) : (
        <div className="cart-wrapper">

          {/* 🧾 PRODUCTS */}
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-card" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>{item.price} EGP</p>

                  <div className="qty">
                    Quantity: <span>{item.qty}</span>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          {/* 💰 SUMMARY */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total</span>
              <span>{total} EGP</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>

            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;