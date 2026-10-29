import logo from "../../assets/logo.png";

function Header({ currentUser, onLogout, onOpenPublicView }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={logo} alt="FUNews Logo" className="header-logo" />
        <span className="header-title">FUNewsManagementSystem</span>
      </div>
      <div className="header-user-info" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {onOpenPublicView && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onOpenPublicView}
            style={{ fontSize: "0.85rem" }}
          >
            Public News Portal
          </button>
        )}
        <span className="user-badge">
          {currentUser?.accountName || currentUser?.accountEmail || "User"} (
          {currentUser?.accountRole === 1 ? "Admin" : "Staff"})
        </span>
        <button type="button" className="btn btn-outline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
