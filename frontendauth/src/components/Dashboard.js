import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="text-center p-5 shadow rounded" style={{ backgroundColor: "#e0f7f1", width: "100%", maxWidth: "500px" }}>
        <div className="mb-4">
          <i className="bi bi-person-circle" style={{ fontSize: "8rem", color: "#00796b" }}></i>
        </div>
        <h2 className="text-dark mb-2">Welcome, {user.username}</h2>
        <h5 className="text-secondary mb-4">{user.email}</h5>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <i className="bi bi-pencil-square"></i>
            Edit Profile
          </button>

          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
