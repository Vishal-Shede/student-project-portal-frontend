import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();           // AuthContext.login(token, user)
  const navigate = useNavigate();
  const location = useLocation();

  // If coming from Register, prefill email or show a small message
  useEffect(() => {
    const justRegistered = location.state?.justRegistered;
    const registeredEmail = location.state?.email;
    if (registeredEmail) setEmail(registeredEmail);
    if (justRegistered) {
      // optional: toast later—keeping it simple now
      console.log("Account created. Please log in.");
    }
  }, [location.state]);

  function validate() {
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    setError("");
    try {
      const { token, user } = await apiLogin({ email: email.trim(), password });
      // Save in global auth and persist (AuthContext handles localStorage)
      login(token, user);
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) setError("Incorrect email or password.");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 420 }}>
      <h1>Login</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ width:"100%", padding:8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            style={{ width:"100%", padding:8 }}
          />
        </div>

        <button disabled={loading} style={{ padding:"8px 14px" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
