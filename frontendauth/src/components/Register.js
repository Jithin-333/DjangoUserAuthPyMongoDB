import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';



function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
      const access = localStorage.getItem('access');
      const user = JSON.parse(localStorage.getItem('user'));

      if (access) {
        navigate(user.admin_user? "/admin_dashboard" : "/dashboard");
      }
    }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register/", form);

      Swal.fire({
        title: "Registration Successful!",
        text: "You can now log in with your credentials.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      navigate("/login");

    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Try a different email.";

      Swal.fire({
        title: "Registration Failed",
        text: errorMessage,
        icon: "error"
      });

      console.log(err);
    } 
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const navigateLogin = () => navigate("/login");

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="p-4 shadow rounded" style={{ maxWidth: 400, width: "100%", backgroundColor: "#f4f9ff" }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill" style={{ fontSize: "3rem", color: "#0d6efd" }}></i>
          <h2 className="mt-2">Register</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>

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
            Register
          </button>

          <div className="text-center">
            <h6 className="text-muted">or</h6>
            <p
              className="text-primary"
              style={{ cursor: "pointer", fontWeight: "500" }}
              onClick={navigateLogin}
            >
              Already registered? Sign in
            </p>
          </div>
        </form>
      </div>
    </div>

  );
}

export default Register;
