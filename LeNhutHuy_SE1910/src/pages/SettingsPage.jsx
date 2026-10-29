import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";

function SettingsPage({ currentUser, onResetData }) {
  const [systemName, setSystemName] = useState("FUNewsManagementSystem");
  const [contactEmail, setContactEmail] = useState("admin@funews.edu.vn");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleConfirmReset = () => {
    onResetData();
    setIsResetConfirmOpen(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>System Settings</h2>
          <p className="page-subtitle">Configure application settings and view system profile</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-success">Settings have been successfully updated!</div>
      )}

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Administrator Profile</h3>
          <div className="profile-details">
            <div className="profile-row">
              <span className="profile-label">Current User:</span>
              <span className="profile-value">{currentUser?.username || "Admin"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">System Role:</span>
              <span className="profile-value">
                <span className="badge badge-primary">
                  {currentUser?.role === 1 ? "Administrator" : "Staff"}
                </span>
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Student:</span>
              <span className="profile-value">Lê Nhựt Huy (CE200376)</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Class Code:</span>
              <span className="profile-value">SE1910</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Course:</span>
              <span className="profile-value">SBA301 - Single Page Application with Spring Boot</span>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>Application Preferences</h3>
          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label htmlFor="sysName">System Name</label>
              <input
                id="sysName"
                type="text"
                className="form-input"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactMail">Contact Email</label>
              <input
                id="contactMail"
                type="email"
                className="form-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Preferences
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h3>Data Management</h3>
          <p className="settings-description">
            Reset all categories, news articles, and user accounts back to original default seed data.
          </p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Reset to Default Seed Data
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All Data"
        message="Are you sure you want to reset all data to default mock records? Any custom categories, news, and users created will be restored."
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}

export default SettingsPage;
