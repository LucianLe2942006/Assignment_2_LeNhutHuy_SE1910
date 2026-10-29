import { useState, useEffect } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { categoryService } from "../services/categoryService";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: 1
  });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchCategories = async (keyword = "") => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(keyword);
      setCategories(data);
    } catch (err) {
      setErrorMessage(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(searchTerm);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setFormData({ name: "", description: "", status: 1 });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setModalMode("update");
    setSelectedCategory(category);
    setFormData({
      name: category.categoryName,
      description: category.categoryDescription || "",
      status: category.isActive ? 1 : 0
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "", status: 1 });
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedDesc = formData.description.trim();

    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }
    if (!trimmedDesc) {
      setFormError("Category description is required.");
      return;
    }

    try {
      if (modalMode === "create") {
        await categoryService.create({
          categoryName: trimmedName,
          categoryDescription: trimmedDesc,
          isActive: formData.status === 1
        });
        setSuccessMessage("Category created successfully.");
      } else if (modalMode === "update" && selectedCategory) {
        await categoryService.update(selectedCategory.categoryId, {
          categoryName: trimmedName,
          categoryDescription: trimmedDesc,
          isActive: formData.status === 1
        });
        setSuccessMessage("Category updated successfully.");
      }
      handleCloseModal();
      fetchCategories(searchTerm);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setFormError(err.message || "Operation failed.");
    }
  };

  const handleOpenDelete = (category) => {
    setErrorMessage("");
    setDeleteTarget(category);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await categoryService.delete(deleteTarget.categoryId);
      setSuccessMessage(`Category "${deleteTarget.categoryName}" deleted successfully.`);
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      fetchCategories(searchTerm);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      // Rang buoc khong duoc xoa category neu co bai viet lien ket
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      setErrorMessage(err.message || "Failed to delete category.");
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
          <h2>Category Management</h2>
          <p className="page-subtitle">Manage news categories and their active status</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add Category
        </button>
      </div>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
              <th>Description</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-state">Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  {searchTerm
                    ? `No categories found matching "${searchTerm}".`
                    : "No categories available."}
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.categoryId}>
                  <td>#{cat.categoryId}</td>
                  <td className="font-medium">{cat.categoryName}</td>
                  <td style={{ maxWidth: "320px", fontSize: "0.875rem", color: "#666" }}>
                    {cat.categoryDescription}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        cat.isActive ? "badge-success" : "badge-secondary"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
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
              placeholder="e.g. Academic News, Technology"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription">Description *</label>
            <textarea
              id="categoryDescription"
              className="form-input"
              rows="3"
              placeholder="Brief description of the category..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
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
        message={`Are you sure you want to delete the category "${deleteTarget?.categoryName}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default CategoryManagement;
