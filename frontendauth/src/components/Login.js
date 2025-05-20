import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'



function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      // localStorage.setItem("username", res.data.username);
      const userData = {
        user_id: res.data.user_id,
        username: res.data.username,
        email: res.data.email,
        admin_user: res.data.admin_user,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      navigate(userData.admin_user ? "/admin_dashboard" : "/dashboard");
    } catch(error) {
       const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
        Swal.fire({
          title: "Login Failed",
          text: errorMessage,
          icon: "error"
        });
      }
  };

  const navigateRegister = () => navigate("/");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="p-4 shadow rounded" style={{ maxWidth: 400, width: "100%", backgroundColor: "#f4f9ff" }}>
        <div className="text-center mb-4">
          <i className="bi bi-box-arrow-in-right" style={{ fontSize: "3rem", color: "#0d6efd" }}></i>
          <h2 className="mt-2">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="form-control pe-5"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}
              onClick={togglePassword}
              style={{
                position: 'absolute',
                top: '50%',
                right: '15px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6c757d',
                fontSize: '1.2rem'
              }}
            />
          </div>

          <button className="btn btn-primary w-100 mb-3" type="submit">
            Login
          </button>

          <div className="text-center">
            <h6 className="text-muted">or</h6>
            <p
              className="text-primary"
              style={{ cursor: "pointer", fontWeight: "500" }}
              onClick={navigateRegister}
            >
              New user? Sign up
            </p>
          </div>
        </form>
      </div>
    </div>

  );
}

export default Login;
