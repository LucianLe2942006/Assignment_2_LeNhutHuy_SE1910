import logo from "../../assets/logo.png";

function Header({ currentUser, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={logo} alt="FUNews Logo" className="header-logo" />
        <span className="header-title">FUNewsManagementSystem</span>
      </div>
      <div className="header-user-info">
        <span className="user-badge">
          {currentUser?.username || "Admin"}
        </span>
        <button type="button" className="btn btn-outline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
