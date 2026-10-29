import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import CategoryManagement from "./pages/CategoryManagement";
import NewsManagement from "./pages/NewsManagement";
import UserManagement from "./pages/UserManagement";
import SettingsPage from "./pages/SettingsPage";
import {
  defaultCategories,
  defaultNews,
  defaultUsers,
  getStoredData,
  setStoredData
} from "./data/initialData";

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredData("funews_auth", null)
  );
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [categories, setCategories] = useState(() =>
    getStoredData("funews_categories", defaultCategories)
  );
  const [news, setNews] = useState(() =>
    getStoredData("funews_news", defaultNews)
  );
  const [users, setUsers] = useState(() =>
    getStoredData("funews_users", defaultUsers)
  );

  useEffect(() => {
    setStoredData("funews_categories", categories);
  }, [categories]);

  useEffect(() => {
    setStoredData("funews_news", news);
  }, [news]);

  useEffect(() => {
    setStoredData("funews_users", users);
  }, [users]);

  useEffect(() => {
    setStoredData("funews_auth", currentUser);
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveMenu("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("funews_auth");
  };

  const handleResetData = () => {
    setCategories(defaultCategories);
    setNews(defaultNews);
    setUsers(defaultUsers);
    setStoredData("funews_categories", defaultCategories);
    setStoredData("funews_news", defaultNews);
    setStoredData("funews_users", defaultUsers);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  return (
    <AdminLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      activeMenu={activeMenu}
      onSelectMenu={setActiveMenu}
    >
      {activeMenu === "dashboard" && (
        <DashboardPage
          categories={categories}
          news={news}
          users={users}
        />
      )}
      {activeMenu === "category" && (
        <CategoryManagement
          categories={categories}
          setCategories={setCategories}
          news={news}
        />
      )}
      {activeMenu === "news" && (
        <NewsManagement
          news={news}
          setNews={setNews}
          categories={categories}
          currentUser={currentUser}
        />
      )}
      {activeMenu === "users" && (
        <UserManagement
          users={users}
          setUsers={setUsers}
          currentUser={currentUser}
        />
      )}
      {activeMenu === "settings" && (
        <SettingsPage
          currentUser={currentUser}
          onResetData={handleResetData}
        />
      )}
    </AdminLayout>
  );
}

export default App;
