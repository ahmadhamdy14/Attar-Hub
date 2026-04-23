import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    addToCart,
    decreaseQty,
  } = useContext(CartContext);

  // 💰 total بعد الخصم
  const total = cart.reduce((acc, item) => {
    const finalPrice =
      item.price - (item.price * (item.discount || 0)) / 100;

    return acc + finalPrice * item.qty;
  }, 0);

  const phoneNumber = "201069199985";

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = "🛒 *New Order* 👇\n\n";

    cart.forEach((item, index) => {
      const finalPrice =
        item.price - (item.price * (item.discount || 0)) / 100;

      message += `🔹 ${index + 1}) ${item.name}\n`;
      message += `Qty: ${item.qty}\n`;
      message += `Price: ${finalPrice.toFixed(0)} EGP\n`;
      message += `-------------------\n`;
    });

    message += `\n💰 *Total:* ${total.toFixed(0)} EGP`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    clearCart();
  };

  return (
    <div className="cart-container">
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-box">
          <h2>😢 Cart is empty</h2>
          <p>Add some products and come back</p>
        </div>
      ) : (
        <div className="cart-wrapper">

          {/* 🧾 ITEMS */}
          <div className="cart-items">
            {cart.map((item) => {
              const finalPrice =
                item.price -
                (item.price * (item.discount || 0)) / 100;

              return (
                <div className="cart-card" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-info">
                    <h3>{item.name}</h3>

                    {/* 💰 السعر */}
                    <p>{finalPrice.toFixed(0)} EGP</p>

                    {/* 🔢 الكمية */}
                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button onClick={() => addToCart(item)}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* ❌ حذف */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✖
                  </button>
                </div>
              );
            })}
          </div>

          {/* 💰 SUMMARY */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total</span>
              <span>{total.toFixed(0)} EGP</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              🚀 Checkout via WhatsApp
            </button>

            <button
              className="clear-btn"
              onClick={clearCart}
            >
              🧹 Clear Cart
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;