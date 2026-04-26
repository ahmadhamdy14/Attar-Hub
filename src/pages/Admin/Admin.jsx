import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const userRef = doc(db, "users", selectedUserId);
      await deleteDoc(userRef);
      setUsers(users.filter(u => u.id !== selectedUserId));
      setShowModal(false);
      setSelectedUserId(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateA - dateB;
  });

  return (
    <div className="admin-container">
      <h1 className="admin-title">👑 Admin Dashboard</h1>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="admin-delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⚠️ Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete this user?</h3>

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

export default Admin;