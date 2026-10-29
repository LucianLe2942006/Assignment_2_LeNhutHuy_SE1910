import { useState, useEffect } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { accountService } from "../services/accountService";

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 2
  });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchUsers = async (keyword = "") => {
    try {
      setLoading(true);
      const data = await accountService.getAll(keyword);
      setUsers(data);
    } catch (err) {
      setErrorMessage(err.message || "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: 2
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode("update");
    setSelectedUser(user);
    setFormData({
      name: user.accountName || "",
      email: user.accountEmail || "",
      password: "",
      role: user.accountRole || 2
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: 2
    });
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPass = formData.password.trim();

    if (!trimmedName) {
      setFormError("Account name is required.");
      return;
    }
    if (!trimmedEmail) {
      setFormError("Account email is required.");
      return;
    }
    if (modalMode === "create" && !trimmedPass) {
      setFormError("Password is required for new accounts.");
      return;
    }

    try {
      if (modalMode === "create") {
        await accountService.create({
          accountName: trimmedName,
          accountEmail: trimmedEmail,
          accountPassword: trimmedPass,
          accountRole: Number(formData.role)
        });
        setSuccessMessage("Account created successfully.");
      } else if (modalMode === "update" && selectedUser) {
        await accountService.update(selectedUser.accountId, {
          accountName: trimmedName,
          accountEmail: trimmedEmail,
          accountPassword: trimmedPass || selectedUser.accountPassword,
          accountRole: Number(formData.role)
        });
        setSuccessMessage("Account updated successfully.");
      }
      handleCloseModal();
      fetchUsers(searchTerm);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setFormError(err.message || "Operation failed.");
    }
  };

  const handleOpenDelete = (user) => {
    setErrorMessage("");
    setDeleteTarget(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await accountService.delete(deleteTarget.accountId);
      setSuccessMessage(`Account "${deleteTarget.accountName}" deleted successfully.`);
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      fetchUsers(searchTerm);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      // Rang buoc khong duoc xoa tai khoan neu da tung tao bai viet
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      setErrorMessage(err.message || "Failed to delete account.");
      setTimeout(() => setErrorMessage(""), 6000);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>User Account Management</h2>
          <p className="page-subtitle">Manage system accounts and roles (Administrator view)</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add Account
        </button>
      </div>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="table-controls">
        <div className="search-bar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by name or email..."
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
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-state">Loading accounts...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  {searchTerm
                    ? `No accounts found matching "${searchTerm}".`
                    : "No accounts available."}
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isCurrentLoggedUser =
                  currentUser?.accountId === u.accountId ||
                  currentUser?.accountEmail?.toLowerCase() === u.accountEmail?.toLowerCase();

                return (
                  <tr key={u.accountId}>
                    <td>#{u.accountId}</td>
                    <td className="font-medium">{u.accountName}</td>
                    <td>{u.accountEmail}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.accountRole === 1 ? "badge-primary" : "badge-secondary"
                        }`}
                      >
                        {u.accountRole === 1 ? "Admin" : "Staff"}
                      </span>
                    </td>
                    <td className="text-right table-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger-outline"
                        onClick={() => handleOpenDelete(u)}
                        disabled={isCurrentLoggedUser}
                        title={
                          isCurrentLoggedUser
                            ? "Cannot delete current logged-in user"
                            : "Delete account"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalMode === "create" ? "Create Account" : "Edit Account"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="form-group">
            <label htmlFor="accountName">Full Name *</label>
            <input
              id="accountName"
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountEmail">Email Address *</label>
            <input
              id="accountEmail"
              type="email"
              className="form-input"
              placeholder="e.g. user@funews.org"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountPassword">
              {modalMode === "create" ? "Password *" : "New Password (leave empty to keep current)"}
            </label>
            <input
              id="accountPassword"
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

          <div className="form-group">
            <label htmlFor="accountRole">System Role</label>
            <select
              id="accountRole"
              className="form-select"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: Number(e.target.value) })
              }
            >
              <option value={1}>Administrator (Role 1)</option>
              <option value={2}>Staff Member (Role 2)</option>
            </select>
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
        title="Delete Account"
        message={`Are you sure you want to delete the account "${deleteTarget?.accountName}" (${deleteTarget?.accountEmail})?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default UserManagement;
