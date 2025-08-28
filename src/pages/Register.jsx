import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/authApi";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  // tiny client validation to catch obvious mistakes before hitting API
  function validate() {
    if (fullName.trim().length < 2) return "Full name must be at least 2 characters.";
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
      await apiRegister({ fullName: fullName.trim(), email: email.trim(), password });
      // success → go to login
      navigate("/login", { state: { justRegistered: true, email } });
    } catch (err) {
      // map common server errors to friendly text
      const status = err?.response?.status;
      if (status === 409) setError("This email is already registered.");
      else if (status === 400) setError(err?.response?.data?.message || "Invalid input.");
      else setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 420 }}>
      <h1>Create account</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Full name</label><br />
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Vishal Shede"
            required
            style={{ width:"100%", padding:8 }}
          />
        </div>

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
            placeholder="At least 8 characters"
            required
            style={{ width:"100%", padding:8 }}
          />
        </div>

        <button disabled={loading} style={{ padding:"8px 14px" }}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default Register;
