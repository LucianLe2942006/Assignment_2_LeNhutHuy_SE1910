function DashboardPage({ categories = [], news = [], users = [] }) {
  const activeCategoriesCount = categories.filter((c) => c.status === 1).length;
  const inactiveCategoriesCount = categories.filter((c) => c.status === 0).length;

  const activeNewsCount = news.filter((n) => n.status === 1).length;
  const inactiveNewsCount = news.filter((n) => n.status === 0).length;

  const adminUsersCount = users.filter((u) => u.role === 1).length;
  const staffUsersCount = users.filter((u) => u.role === 2).length;

  const getCategoryName = (categoryId) => {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "Uncategorized";
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="page-subtitle">Summary metrics and system status</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Categories</span>
          </div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-breakdown">
            <span className="badge badge-success">{activeCategoriesCount} Active</span>
            <span className="badge badge-secondary">{inactiveCategoriesCount} Inactive</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">News Articles</span>
          </div>
          <div className="stat-value">{news.length}</div>
          <div className="stat-breakdown">
            <span className="badge badge-success">{activeNewsCount} Active</span>
            <span className="badge badge-secondary">{inactiveNewsCount} Inactive</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Accounts</span>
          </div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-breakdown">
            <span className="badge badge-primary">{adminUsersCount} Admin</span>
            <span className="badge badge-purple">{staffUsersCount} Staff</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Articles</h3>
        {news.length === 0 ? (
          <div className="empty-state">No articles available.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {news.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td className="font-medium">{item.title}</td>
                    <td>
                      <span className="badge badge-info">{getCategoryName(item.categoryId)}</span>
                    </td>
                    <td>{item.createdBy}</td>
                    <td>
                      <span className={`badge ${item.status === 1 ? "badge-success" : "badge-secondary"}`}>
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
