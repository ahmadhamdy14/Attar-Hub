import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import "./OrderSuccess.css";

const STATUS_LABELS = {
  pending: { label: "booking", color: "#f59e0b" },
  processing: { label: "processing", color: "#3b82f6" },
  shipped: { label: "shipping", color: "#8b5cf6" },
  delivered: { label: "delivered", color: "#22c55e" },
  cancelled: { label: "cancel", color: "#ef4444" },
};

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="success-container">
        <div className="success-loading">loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="success-container">
        <div className="success-not-found">
          <h2>oops! not found</h2>
          <Link to="/products" className="success-back-btn">
            go to products
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;

  const formatDate = (ts) => {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="success-container">
      <div className="success-card">
        {/* ✅ Animated checkmark */}
        <div className="success-icon">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <h1 className="success-title">thank you!🎉</h1>
        <p className="success-sub">
          thank you, <strong>{order.customer?.firstName}</strong>! order recived successfully 😊.
        </p>

        {/* 📋 Order Meta */}
        <div className="success-meta">
          <div className="meta-item">
            <span className="meta-label">order id</span>
            <span className="meta-value order-id">{order.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">date</span>
            <span className="meta-value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">address</span>
            <span className="meta-value">{order.customer?.address || "—"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">status</span>
            <span
              className="status-badge"
              style={{ background: `${statusInfo.color}22`, color: statusInfo.color, border: `1px solid ${statusInfo.color}44` }}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* 📦 Items */}
        <div className="success-items">
          <h3>items 🛎️</h3>
          {order.items.map((item) => {
            const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
            return (
              <div className="success-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="success-item-info">
                  <span className="success-item-name">{item.name}</span>
                  <span className="success-item-qty">x{item.qty}</span>
                </div>
                <span className="success-item-price">
                  {(finalPrice * item.qty).toFixed(0)} EGP
                </span>
              </div>
            );
          })}
        </div>

        {/* 💰 Total */}
        <div className="success-total">
          <span>total</span>
          <span className="success-total-amount">{order.totalPrice?.toFixed(0)} EGP</span>
        </div>

        <Link to="/products" className="success-back-btn">
          go to buy more 🛍️
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
