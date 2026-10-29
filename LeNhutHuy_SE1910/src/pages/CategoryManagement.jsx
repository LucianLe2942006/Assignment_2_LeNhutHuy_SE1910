import { useState } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function CategoryManagement({ categories, setCategories, news = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({ name: "", status: 1 });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [relationError, setRelationError] = useState("");

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setFormData({ name: "", status: 1 });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setModalMode("update");
    setSelectedCategory(category);
    setFormData({ name: category.name, status: category.status });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", status: 1 });
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }

    if (modalMode === "create") {
      const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
      const newCategory = {
        id: nextId,
        name: trimmedName,
        status: Number(formData.status)
      };
      setCategories([...categories, newCategory]);
    } else if (modalMode === "update" && selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, name: trimmedName, status: Number(formData.status) }
          : cat
      );
      setCategories(updatedCategories);
    }

    handleCloseModal();
  };

  const handleOpenDelete = (category) => {
    const linkedNews = news.filter((n) => n.categoryId === category.id);
    if (linkedNews.length > 0) {
      setRelationError(
        `Cannot delete "${category.name}" because it is currently linked to ${linkedNews.length} news article(s). Please reassign or delete associated articles first.`
      );
      setTimeout(() => setRelationError(""), 5000);
      return;
    }
    setRelationError("");
    setDeleteTarget(category);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      const updatedCategories = categories.filter((c) => c.id !== deleteTarget.id);
      setCategories(updatedCategories);
    }
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const displayedCategories = categories.filter((cat) =>
    (cat.name || "").toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Category Management</h2>
          <p className="page-subtitle">Manage news categories and their active status</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add Category
        </button>
      </div>

      {relationError && <div className="alert alert-error">{relationError}</div>}

      <div className="table-controls">
        <div className="search-bar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search category by name..."
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
              <th>Category Name</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  {searchTerm
                    ? `No categories found matching "${searchTerm}".`
                    : "No categories available."}
                </td>
              </tr>
            ) : (
              displayedCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td className="font-medium">{cat.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        cat.status === 1 ? "badge-success" : "badge-secondary"
                      }`}
                    >
                      {cat.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-outline"
                      onClick={() => handleOpenDelete(cat)}
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
        title={modalMode === "create" ? "Create Category" : "Edit Category"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="form-group">
            <label htmlFor="categoryName">Category Name *</label>
            <input
              id="categoryName"
              type="text"
              className="form-input"
              placeholder="e.g. Technology, Education"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryStatus">Status</label>
            <select
              id="categoryStatus"
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
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default CategoryManagement;
