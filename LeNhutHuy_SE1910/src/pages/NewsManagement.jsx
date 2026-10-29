import { useState, useEffect } from "react";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { newsService } from "../services/newsService";
import { categoryService } from "../services/categoryService";

function NewsManagement({ currentUser }) {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    headline: "",
    content: "",
    source: "Internet",
    categoryId: "",
    status: 1,
    tagIds: []
  });
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, catsData, tagsData] = await Promise.all([
        newsService.getAll(searchTerm, filterCategory || null, filterStatus !== "" ? filterStatus === "1" : null),
        categoryService.getAll(),
        newsService.getTags()
      ]);
      setNews(newsData);
      setCategories(catsData);
      setAvailableTags(tagsData);
    } catch (err) {
      setErrorMessage(err.message || "Failed to load news articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, filterCategory, filterStatus]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedArticle(null);
    setFormData({
      title: "",
      headline: "",
      content: "",
      source: "Internet",
      categoryId: categories[0]?.categoryId || "",
      status: 1,
      tagIds: []
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setModalMode("update");
    setSelectedArticle(article);
    setFormData({
      title: article.newsTitle || "",
      headline: article.headline || "",
      content: article.newsContent || "",
      source: article.newsSource || "Internet",
      categoryId: article.categoryId || "",
      status: article.newsStatus ? 1 : 0,
      tagIds: article.tagIds || (article.tags ? article.tags.map((t) => t.tagId) : [])
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    setFormData({
      title: "",
      headline: "",
      content: "",
      source: "Internet",
      categoryId: "",
      status: 1,
      tagIds: []
    });
    setFormError("");
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      const newTagIds = exists
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds: newTagIds };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    const trimmedHeadline = formData.headline.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedHeadline) {
      setFormError("Headline is required.");
      return;
    }
    if (!trimmedContent) {
      setFormError("Content is required.");
      return;
    }
    if (!formData.categoryId) {
      setFormError("Please select a Category.");
      return;
    }

    const payload = {
      newsTitle: trimmedTitle || trimmedHeadline,
      headline: trimmedHeadline,
      newsContent: trimmedContent,
      newsSource: formData.source.trim() || "Internet",
      categoryId: Number(formData.categoryId),
      newsStatus: formData.status === 1,
      tagIds: formData.tagIds,
      createdById: currentUser?.accountId
    };

    try {
      if (modalMode === "create") {
        await newsService.create(payload, currentUser?.accountId);
        setSuccessMessage("Article created successfully.");
      } else if (modalMode === "update" && selectedArticle) {
        await newsService.update(selectedArticle.newsArticleId, payload, currentUser?.accountId);
        setSuccessMessage("Article updated successfully.");
      }
      handleCloseModal();
      loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setFormError(err.message || "Failed to save article.");
    }
  };

  const handleOpenDelete = (article) => {
    setErrorMessage("");
    setDeleteTarget(article);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await newsService.delete(deleteTarget.newsArticleId);
      setSuccessMessage(`Article "${deleteTarget.newsTitle || deleteTarget.headline}" deleted successfully.`);
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      setErrorMessage(err.message || "Failed to delete article.");
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
          <h2>News Article Management</h2>
          <p className="page-subtitle">Publish, modify, and manage news articles and associated tags</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          + Add Article
        </button>
      </div>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="table-controls" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by title or content..."
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

        <div style={{ display: "flex", gap: "8px" }}>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: "170px" }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "130px" }}
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title / Headline</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Created By</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">Loading news articles...</td>
              </tr>
            ) : news.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No news articles found matching your criteria.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.newsArticleId}>
                  <td>#{item.newsArticleId}</td>
                  <td className="font-medium" style={{ maxWidth: "260px" }}>
                    <div>{item.newsTitle || item.headline}</div>
                    <div style={{ fontSize: "0.78rem", color: "#888" }}>
                      {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : ""}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {item.categoryName || "Uncategorized"}
                    </span>
                  </td>
                  <td style={{ maxWidth: "200px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((t) => (
                          <span
                            key={t.tagId}
                            style={{
                              background: "#e2e8f0",
                              color: "#334155",
                              fontSize: "0.72rem",
                              padding: "1px 6px",
                              borderRadius: "4px"
                            }}
                          >
                            #{t.tagName}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#aaa", fontSize: "0.8rem" }}>No tags</span>
                      )}
                    </div>
                  </td>
                  <td>{item.createdByName || "Staff"}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.newsStatus ? "badge-success" : "badge-secondary"
                      }`}
                    >
                      {item.newsStatus ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-outline"
                      onClick={() => handleOpenDelete(item)}
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
            <label htmlFor="articleTitle">News Title</label>
            <input
              id="articleTitle"
              type="text"
              className="form-input"
              placeholder="Article main title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="articleHeadline">Headline *</label>
            <input
              id="articleHeadline"
              type="text"
              className="form-input"
              placeholder="Catchy headline"
              value={formData.headline}
              onChange={(e) => {
                setFormData({ ...formData, headline: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="articleCategory">Category *</label>
              <select
                id="articleCategory"
                className="form-select"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName} {!c.isActive ? "(Inactive)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="articleStatus">Status</label>
              <select
                id="articleStatus"
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

          <div className="form-group">
            <label>Tags</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "8px",
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid #cbd5e1",
                padding: "8px",
                borderRadius: "6px"
              }}
            >
              {availableTags.map((tag) => (
                <label
                  key={tag.tagId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.tagId)}
                    onChange={() => handleTagToggle(tag.tagId)}
                  />
                  <span>#{tag.tagName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="articleContent">Content *</label>
            <textarea
              id="articleContent"
              className="form-textarea"
              rows={5}
              placeholder="Write the full article content..."
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (formError) setFormError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="articleSource">Source</label>
            <input
              id="articleSource"
              type="text"
              className="form-input"
              placeholder="e.g. Campus News, Internet"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            />
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
              {modalMode === "create" ? "Create Article" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete News Article"
        message={`Are you sure you want to delete the article "${deleteTarget?.newsTitle || deleteTarget?.headline}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default NewsManagement;
