function Sidebar({ activeMenu, onSelectMenu, currentUser }) {
  const isAdmin = currentUser?.accountRole === 1;

  const menuItems = isAdmin
    ? [
        { key: "users", label: "User Accounts" },
        { key: "settings", label: "System Info" }
      ]
    : [
        { key: "news", label: "News Articles" },
        { key: "category", label: "Categories" },
        { key: "settings", label: "Profile & History" }
      ];

  return (
    <aside className="app-sidebar">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #334155" }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: 600 }}>
          {isAdmin ? "Administrator Portal" : "Staff Portal"}
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activeMenu === item.key ? "active" : ""}`}
            onClick={() => onSelectMenu(item.key)}
          >
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
