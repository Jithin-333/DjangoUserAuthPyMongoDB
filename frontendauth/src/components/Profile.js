import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';



function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  if (user) {
    setForm({
      username: user.username,
      email: user.email,
      password: '' 
    });
  }
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/user_detail/${user.username}/`, form);

      await Swal.fire({
        icon: 'success',
        title: 'Profile updated',
        showConfirmButton: false,
        timer: 1800,
      });

      navigate("/dashboard");
    } catch(err) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Please try again later.',
      });
      console.log(err);
    }
  };

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action will delete your account permanently!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8000/api/user_detail/${user.username}/`);
      localStorage.clear();
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your account has been deleted.',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong while deleting your account.',
      });
    }
  }
};

  return (
  <div className="container mt-5 border border-primary rounded shadow p-4 bg-white" style={{ maxWidth: 400 }}>
    <h2 className="mb-4 text-center text-primary">Update Profile</h2>

    <form onSubmit={handleUpdate}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          name="username"
          id="username"
          className="form-control"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          name="email"
          id="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">New Password</label>
        <input
          name="password"
          type="password"
          id="password"
          className="form-control"
          placeholder="Enter new password"
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary w-100" type="submit">
        Update
      </button>
    </form>

    <hr className="my-4" />

    <button className="btn btn-outline-danger w-100" onClick={handleDelete}>
      Delete Account <i className="bi bi-trash ms-1"></i>
    </button>
  </div>

  );
}

export default Profile;
