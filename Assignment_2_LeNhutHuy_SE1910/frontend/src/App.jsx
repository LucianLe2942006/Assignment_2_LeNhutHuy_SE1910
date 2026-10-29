import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import PublicNewsPage from "./pages/PublicNewsPage";
import AdminLayout from "./components/layout/AdminLayout";
import CategoryManagement from "./pages/CategoryManagement";
import NewsManagement from "./pages/NewsManagement";
import UserManagement from "./pages/UserManagement";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("funews_auth");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGuestMode, setIsGuestMode] = useState(false);

  const [activeMenu, setActiveMenu] = useState(() => {
    try {
      const saved = localStorage.getItem("funews_auth");
      const user = saved ? JSON.parse(saved) : null;
      return user?.accountRole === 1 ? "users" : "news";
    } catch {
      return "news";
    }
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsGuestMode(false);
    // Role 1 (Admin) -> users, Role 2 (Staff) -> news
    if (user.accountRole === 1) {
      setActiveMenu("users");
    } else {
      setActiveMenu("news");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("funews_auth");
    setIsGuestMode(false);
  };

  if (isGuestMode) {
    return <PublicNewsPage onGoToLogin={() => setIsGuestMode(false)} />;
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGuestView={() => setIsGuestMode(true)}
      />
    );
  }

  return (
    <AdminLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      activeMenu={activeMenu}
      onSelectMenu={setActiveMenu}
      onOpenPublicView={() => setIsGuestMode(true)}
    >
      {activeMenu === "category" && (
        <CategoryManagement />
      )}
      {activeMenu === "news" && (
        <NewsManagement currentUser={currentUser} />
      )}
      {activeMenu === "users" && (
        <UserManagement currentUser={currentUser} />
      )}
      {activeMenu === "settings" && (
        <SettingsPage
          currentUser={currentUser}
          onUserUpdated={setCurrentUser}
        />
      )}
    </AdminLayout>
  );
}

export default App;
