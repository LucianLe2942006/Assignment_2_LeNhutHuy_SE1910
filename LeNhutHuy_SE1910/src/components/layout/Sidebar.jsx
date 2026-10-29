function Sidebar({ activeMenu, onSelectMenu }) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "category", label: "Category" },
    { key: "news", label: "News" },
    { key: "users", label: "Users" },
    { key: "settings", label: "Settings" }
  ];

  return (
    <aside className="app-sidebar">
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
