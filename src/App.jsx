import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import Register from "./pages/Register";


function Login() {
  return <h1>Login Page</h1>;
}

function Dashboard() {
  return <h1>Dashboard Page</h1>;
}

function App() {

    // temporary debug
    console.log("API base:", import.meta.env.VITE_API_BASE_URL);
    console.log("Auth state:", window.localStorage.getItem("token"), window.localStorage.getItem("user"));


  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
