import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.fullName?.split(" ")[0] ?? "Guest";
  const linkBase = { marginRight: "1rem", textDecoration: "none" };
  const linkStyle = ({ isActive }) => ({
    ...linkBase,
    fontWeight: isActive ? "700" : "400",
  });

  function handleLogout() {
    logout();          // clears context + localStorage
    navigate("/");     // send back to Home
  }

  return (
    <nav
      style={{
        padding: "0.75rem 1rem",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <NavLink to="/" style={linkStyle}>Home</NavLink>

        {isAuth ? (
          <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        ) : (
          <>
            <NavLink to="/login" style={linkStyle}>Login</NavLink>
            <NavLink to="/register" style={linkStyle}>Register</NavLink>
          </>
        )}
      </div>

      <div>
        <span style={{ marginRight: "0.75rem", color: "#555" }}>
          {isAuth ? `Hi, ${firstName}` : "Guest"}
        </span>
        {isAuth && (
          <button onClick={handleLogout} style={{ padding: "6px 10px" }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
