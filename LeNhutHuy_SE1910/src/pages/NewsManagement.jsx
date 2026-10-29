import { useState } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function NewsManagement({ news, setNews, categories, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: categories[0]?.id || 1,
    createdBy: currentUser?.username || "Admin",
    status: 1
  });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getCategoryName = (catId) => {
    const found = categories.find((c) => c.id === Number(catId));
    return found ? found.name : "Unknown";
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedArticle(null);
    setFormData({
      title: "",
      content: "",
      categoryId: categories[0]?.id || 1,
      createdBy: currentUser?.username || "Admin",
      status: 1
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setModalMode("update");
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId,
      createdBy: article.createdBy,
      status: article.status
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    setFormData({
      title: "",
      content: "",
      categoryId: categories[0]?.id || 1,
      createdBy: currentUser?.username || "Admin",
      status: 1
    });
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError("Both Title and Content are required.");
      return;
    }

    if (categories.length === 0) {
      setFormError("No categories available. Please create a category first.");
      return;
    }

    const categoryExists = categories.some((c) => c.id === Number(formData.categoryId));
    if (!formData.categoryId || !categoryExists) {
      setFormError("Please select a valid existing Category.");
      return;
    }

    if (modalMode === "create") {
      const nextId = news.length > 0 ? Math.max(...news.map((n) => n.id)) + 1 : 1;
      const newArticle = {
        id: nextId,
        title: trimmedTitle,
        content: trimmedContent,
        categoryId: Number(formData.categoryId),
        createdBy: formData.createdBy || "Admin",
        status: Number(formData.status)
      };
      setNews([...news, newArticle]);
    } else if (modalMode === "update" && selectedArticle) {
      const updatedNews = news.map((item) =>
        item.id === selectedArticle.id
          ? {
              ...item,
              title: trimmedTitle,
              content: trimmedContent,
              categoryId: Number(formData.categoryId),
              createdBy: formData.createdBy,
              status: Number(formData.status)
            }
          : item
      );
      setNews(updatedNews);
    }

    handleCloseModal();
  };

  const handleOpenDelete = (article) => {
    setDeleteTarget(article);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      const updatedNews = news.filter((n) => n.id !== deleteTarget.id);
      setNews(updatedNews);
    }
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const displayedNews = news.filter(
    (item) =>
      (item.title || "").toLowerCase().includes(normalizedSearch) ||
      (item.content || "").toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>News Management</h2>
          <p className="page-subtitle">Publish, modify, and manage news articles</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add Article
        </button>
      </div>

      <div className="table-controls">
        <div className="search-bar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search news by title or content..."
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
              <th>Title</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedNews.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  {searchTerm
                    ? `No news articles found matching "${searchTerm}".`
                    : "No news articles available."}
                </td>
              </tr>
            ) : (
              displayedNews.map((article) => (
                <tr key={article.id}>
                  <td>#{article.id}</td>
                  <td>
                    <div className="font-medium">{article.title}</div>
                    <div className="table-secondary-text">
                      {article.content.length > 70
                        ? `${article.content.substring(0, 70)}...`
                        : article.content}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {getCategoryName(article.categoryId)}
                    </span>
                  </td>
                  <td>{article.createdBy}</td>
                  <td>
                    <span
                      className={`badge ${
                        article.status === 1 ? "badge-success" : "badge-secondary"
                      }`}
                    >
                      {article.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenEdit(article)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-outline"
                      onClick={() => handleOpenDelete(article)}
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
        title={modalMode === "create" ? "Create News Article" : "Edit News Article"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="form-group">
            <label htmlFor="newsTitle">Title *</label>
            <input
              id="newsTitle"
              type="text"
              className="form-input"
              placeholder="Article title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newsCategory">Category *</label>
            <select
              id="newsCategory"
              className="form-select"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.status === 0 ? "(Inactive)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="newsContent">Content *</label>
            <textarea
              id="newsContent"
              className="form-textarea"
              rows={4}
              placeholder="Write the article content..."
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="newsCreatedBy">Created By</label>
              <input
                id="newsCreatedBy"
                type="text"
                className="form-input"
                value={formData.createdBy}
                onChange={(e) =>
                  setFormData({ ...formData, createdBy: e.target.value })
                }
              />
            </div>
            <div className="form-group form-col">
              <label htmlFor="newsStatus">Status</label>
              <select
                id="newsStatus"
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
        title="Delete News Article"
        message={`Are you sure you want to delete the article "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default NewsManagement;
