import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { newsService } from "../services/newsService";

function PublicNewsPage({ onGoToLogin }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchPublicNews();
  }, []);

  const fetchPublicNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getPublic();
      setArticles(data);
    } catch (err) {
      setError(err.message || "Failed to load public news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-news-layout" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header className="app-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div className="header-brand">
          <img src={logo} alt="FUNews Logo" className="header-logo" />
          <span className="header-title">FUNewsManagementSystem — Public Portal</span>
        </div>
        <div className="header-user-info">
          <button type="button" className="btn btn-primary" onClick={onGoToLogin}>
            Sign In Portal
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "24px auto", padding: "0 16px" }}>
        <div style={{ marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Latest Campus News & Announcements
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Public news articles published for students, faculty, and alumni.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
            Loading latest news articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
            No public news articles available at the moment.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {articles.map((item) => (
              <div
                key={item.newsArticleId}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span className="badge badge-primary">{item.categoryName || "General"}</span>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px", lineHeight: 1.4 }}>
                    {item.newsTitle || item.headline}
                  </h3>

                  <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "14px" }}>
                    {item.newsContent && item.newsContent.length > 180
                      ? item.newsContent.substring(0, 180) + "..."
                      : item.newsContent}
                  </p>
                </div>

                <div>
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                      {item.tags.map((t) => (
                        <span key={t.tagId} style={{ background: "#f1f5f9", color: "#475569", fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px" }}>
                          #{t.tagName}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      By: <strong>{item.createdByName || "Staff"}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedArticle(item)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Read More Modal */}
        {selectedArticle && (
          <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
            <div className="modal-container" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedArticle.newsTitle || selectedArticle.headline}</h3>
                <button type="button" className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                  ×
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: "65vh", overflowY: "auto" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
                  <span className="badge badge-primary">{selectedArticle.categoryName}</span>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Published: {selectedArticle.createdDate ? new Date(selectedArticle.createdDate).toLocaleString() : ""}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Author: {selectedArticle.createdByName || "Staff"}
                  </span>
                </div>
                <h4 style={{ color: "#334155", fontStyle: "italic", marginBottom: "16px" }}>
                  {selectedArticle.headline}
                </h4>
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.7, color: "#1e293b" }}>
                  {selectedArticle.newsContent}
                </div>
                {selectedArticle.newsSource && selectedArticle.newsSource !== "N/A" && (
                  <p style={{ marginTop: "16px", fontSize: "0.85rem", color: "#64748b" }}>
                    Source: {selectedArticle.newsSource}
                  </p>
                )}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {selectedArticle.tags.map((t) => (
                      <span key={t.tagId} className="badge badge-secondary">
                        #{t.tagName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PublicNewsPage;
