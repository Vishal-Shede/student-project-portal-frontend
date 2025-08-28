import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}

export default Navbar;
