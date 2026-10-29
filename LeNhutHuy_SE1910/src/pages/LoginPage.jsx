import { useState } from "react";
import logo from "../assets/logo.png";

function LoginPage({ onLogin, users = [] }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError("Please enter both username and password.");
      return;
    }

    if (trimmedUser === "Admin" && trimmedPass === "Admin") {
      setError("");
      const adminUser = users.find((u) => (u.username || "").toLowerCase() === "admin") || {
        id: 1,
        username: "Admin",
        role: 1,
        status: 1
      };
      onLogin(adminUser);
      return;
    }

    const matchedUser = users.find(
      (u) => (u.username || "").toLowerCase() === trimmedUser.toLowerCase() && u.password === trimmedPass
    );

    if (matchedUser) {
      if (matchedUser.status === 0) {
        setError("This account is currently inactive.");
        return;
      }
      setError("");
      onLogin(matchedUser);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="FUNews Logo" className="login-logo" />
          <h2>FUNewsManagementSystem</h2>
          <p className="login-subtitle">Sign in to access management portal</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>

          <div className="login-hint">
            <span>Default credentials: <strong>Admin</strong> / <strong>Admin</strong></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
