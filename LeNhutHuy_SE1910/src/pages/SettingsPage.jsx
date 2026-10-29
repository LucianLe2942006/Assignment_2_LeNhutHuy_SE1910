import { useState, useEffect } from "react";
import { accountService } from "../services/accountService";
import { newsService } from "../services/newsService";

function SettingsPage({ currentUser, onUserUpdated }) {
  const [profileName, setProfileName] = useState(currentUser?.accountName || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.accountEmail || "");
  const [newPassword, setNewPassword] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [saving, setSaving] = useState(false);

  // Lich su bai viet cua Staff
  const [myHistory, setMyHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (currentUser?.accountId) {
      loadMyHistory();
    }
  }, [currentUser]);

  const loadMyHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await newsService.getHistory(currentUser.accountId);
      setMyHistory(data);
    } catch (err) {
      console.error("Failed to load staff history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmedName = profileName.trim();
    if (!trimmedName) {
      setProfileError("Account name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setProfileError("");
      const updated = await accountService.update(currentUser.accountId, {
        accountName: trimmedName,
        accountEmail: profileEmail,
        accountPassword: newPassword.trim() || undefined,
        accountRole: currentUser.accountRole
      });

      // Update in localStorage
      const updatedUser = {
        ...currentUser,
        accountName: updated.accountName,
        accountEmail: updated.accountEmail
      };
      localStorage.setItem("funews_auth", JSON.stringify(updatedUser));
      if (onUserUpdated) onUserUpdated(updatedUser);

      setProfileSuccess("Profile updated successfully!");
      setNewPassword("");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Account Profile & Settings</h2>
          <p className="page-subtitle">Manage personal profile details and track created articles</p>
        </div>
      </div>

      {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
      {profileError && <div className="alert alert-error">{profileError}</div>}

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="settings-card">
          <h3>User Profile Information</h3>
          <div className="profile-details">
            <div className="profile-row">
              <span className="profile-label">Current Account:</span>
              <span className="profile-value">{currentUser?.accountName || "User"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{currentUser?.accountEmail}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">System Role:</span>
              <span className="profile-value">
                <span className={`badge ${currentUser?.accountRole === 1 ? "badge-primary" : "badge-secondary"}`}>
                  {currentUser?.accountRole === 1 ? "Administrator" : "Staff Member"}
                </span>
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Student:</span>
              <span className="profile-value">Lê Nhựt Huy (MSSV: SE1910)</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Course:</span>
              <span className="profile-value">SBA301 - RESTful Web Service and ReactJS</span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="settings-card">
          <h3>Update My Profile</h3>
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-group">
              <label htmlFor="staffName">Full Name *</label>
              <input
                id="staffName"
                type="text"
                className="form-input"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="staffEmail">Email (Read-only)</label>
              <input
                id="staffEmail"
                type="email"
                className="form-input"
                value={profileEmail}
                disabled
                style={{ background: "#f1f5f9" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="staffNewPass">New Password (leave empty to keep current)</label>
              <input
                id="staffNewPass"
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      {/* Staff Article History Section */}
      <div style={{ marginTop: "32px" }}>
        <div className="page-header" style={{ marginBottom: "16px" }}>
          <div>
            <h3>My Authored Articles (History)</h3>
            <p className="page-subtitle">Listing all news articles created by your account</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadMyHistory}>
            Refresh History
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title / Headline</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr>
                  <td colSpan="6" className="empty-state">Loading history...</td>
                </tr>
              ) : myHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    You have not published any news articles yet.
                  </td>
                </tr>
              ) : (
                myHistory.map((article) => (
                  <tr key={article.newsArticleId}>
                    <td>#{article.newsArticleId}</td>
                    <td className="font-medium">{article.newsTitle || article.headline}</td>
                    <td>
                      <span className="badge badge-primary">
                        {article.categoryName || "General"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {article.tags && article.tags.length > 0 ? (
                          article.tags.map((t) => (
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
                          <span style={{ color: "#aaa", fontSize: "0.8rem" }}>None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {article.createdDate
                        ? new Date(article.createdDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          article.newsStatus ? "badge-success" : "badge-secondary"
                        }`}
                      >
                        {article.newsStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
