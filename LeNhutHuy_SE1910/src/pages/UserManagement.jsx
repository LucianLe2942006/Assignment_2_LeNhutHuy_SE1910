import { useState } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function UserManagement({ users, setUsers, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: 2,
    status: 1
  });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      username: "",
      password: "",
      role: 2,
      status: 1
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode("update");
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      status: user.status
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      username: "",
      password: "",
      role: 2,
      status: 1
    });
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setFormError("Both Username and Password are required.");
      return;
    }

    const duplicateUser = users.find(
      (u) =>
        (u.username || "").toLowerCase() === trimmedUsername.toLowerCase() &&
        (modalMode === "create" || u.id !== selectedUser?.id)
    );

    if (duplicateUser) {
      setFormError("Username is already taken. Please choose another.");
      return;
    }

    if (modalMode === "create") {
      const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: nextId,
        username: trimmedUsername,
        password: trimmedPassword,
        role: Number(formData.role),
        status: Number(formData.status)
      };
      setUsers([...users, newUser]);
    } else if (modalMode === "update" && selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              username: trimmedUsername,
              password: trimmedPassword,
              role: Number(formData.role),
              status: Number(formData.status)
            }
          : u
      );
      setUsers(updatedUsers);
    }

    handleCloseModal();
  };

  const handleOpenDelete = (user) => {
    setDeleteTarget(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      const updatedUsers = users.filter((u) => u.id !== deleteTarget.id);
      setUsers(updatedUsers);
    }
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const displayedUsers = users.filter((u) =>
    (u.username || "").toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>User Management</h2>
          <p className="page-subtitle">Manage system accounts, user roles, and access status</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add User
        </button>
      </div>

      <div className="table-controls">
        <div className="search-bar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  {searchTerm
                    ? `No users found matching "${searchTerm}".`
                    : "No users available."}
                </td>
              </tr>
            ) : (
              displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td className="font-medium">
                    {user.username}{" "}
                    {(currentUser?.username || "").toLowerCase() === (user.username || "").toLowerCase() && (
                      <span className="badge badge-info">(You)</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === 1 ? "badge-primary" : "badge-purple"
                      }`}
                    >
                      {user.role === 1 ? "Admin" : "Staff"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === 1 ? "badge-success" : "badge-secondary"
                      }`}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-outline"
                      onClick={() => handleOpenDelete(user)}
                      disabled={(currentUser?.username || "").toLowerCase() === (user.username || "").toLowerCase()}
                      title={
                        (currentUser?.username || "").toLowerCase() === (user.username || "").toLowerCase()
                          ? "Cannot delete current logged-in user"
                          : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalMode === "create" ? "Create User Account" : "Edit User Account"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="form-group">
            <label htmlFor="userUsername">Username *</label>
            <input
              id="userUsername"
              type="text"
              className="form-input"
              placeholder="e.g. alex_admin"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPassword">Password *</label>
            <input
              id="userPassword"
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="userRole">Role</label>
              <select
                id="userRole"
                className="form-select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: Number(e.target.value) })
                }
              >
                <option value={1}>Admin (Role 1)</option>
                <option value={2}>Staff (Role 2)</option>
              </select>
            </div>
            <div className="form-group form-col">
              <label htmlFor="userStatus">Status</label>
              <select
                id="userStatus"
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: Number(e.target.value) })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {modalMode === "create" ? "Create" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete User Account"
        message={`Are you sure you want to delete the user account "${deleteTarget?.username}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default UserManagement;
