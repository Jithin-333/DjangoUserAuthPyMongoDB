import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const AdminDashboard = () => {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ username: '', email: '', admin_user: false });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
        const access = localStorage.getItem('access');
        const user = JSON.parse(localStorage.getItem('user'));
  
        if (access) {
          navigate(user.admin_user? "/admin_dashboard" : "/dashboard");
        }
      }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user/');
      setUsers(res.data);
      console.log(res.data)
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedUser({ username: user.username, email: user.email, admin_user: user.admin_user });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete the user.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/user/${userId}/delete/`);
        await fetchUsers(); // Refresh the user list
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete user. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/${selectedUser._id}/`, updatedUser);
      setShowModal(false);
      fetchUsers();
      setError(null);

      Swal.fire({
        icon: 'success',
        title: 'User Updated',
        text: 'The user information has been successfully updated.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update user. Please try again.';
      setError(errorMessage);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Admin Dashboard</h2>
            <h5
            className="text-danger"
            style={{ cursor: 'pointer' }}
            onClick={handleLogout}
            >
            Logout <i className="bi bi-box-arrow-right ms-1"></i>
            </h5>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
            {users.map((user) => (
            <div className="col-md-4 mb-4" key={user._id}>
                <div className="card shadow h-100">
                <div className="card-body">
                    <h5 className="card-title text-capitalize">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    {user.username}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
                    <p className={`badge ${user.admin_user ? "bg-warning text-dark" : "bg-secondary"}`}>
                    {user.admin_user ? 'Admin' : 'User'}
                    </p>
                    <div className="mt-3">
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleEditClick(user)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(user._id)}
                    >
                        Delete
                    </button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Modal for Editing User */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedUser.username}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Admin"
                  checked={updatedUser.admin_user}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      admin_user: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="px-4 pb-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

    </div>

  );
};

export default AdminDashboard;
