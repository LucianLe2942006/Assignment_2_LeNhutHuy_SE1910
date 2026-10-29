import { useState } from "react";
import logo from "../assets/logo.png";
import { authService } from "../services/authService";

function LoginPage({ onLogin, onGuestView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const user = await authService.login(trimmedEmail, trimmedPass);
      localStorage.setItem("funews_auth", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={onGuestView}
              style={{ marginTop: "8px" }}
            >
              Browse Public News (Guest Mode)
            </button>
          </div>

          <div className="login-hint">
            <div><strong>Admin:</strong> SteveParis@FUNewsManagement.org / @1</div>
            <div><strong>Staff:</strong> EmmaWilliam@FUNewsManagement.org / @1</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
