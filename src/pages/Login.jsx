import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/api/axiosConfig";
import "../assets/styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
e.preventDefault();
try {
    const response = await api.post("/loginUser", {
        username: userName,
        password: password,
    });

    console.log("Login response:", response.data);

   const token = response.data.token;
const user = response.data.data;

// Save token and user details
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

console.log("Logged-in user:", user);
console.log("User ID:", user.id);
console.log("User role:", user.userMembershipType);


    navigate("/dashboard");

} catch (error) {
    console.error("Login failed:", error.response?.data || error.message);

    alert(
        error.response?.data?.message ||
        error.message ||
        "INVALID CREDENTIALS"
    );
}
};


  return (
    <div className="login-container">
      <h2 className="login-title">
        Library Management System
      </h2>
  
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
  
        <div className="form-group">
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
  
      <div className="login-footer">
        Welcome to the Library Management System
      </div>
    </div>
  );
  }
export default Login;