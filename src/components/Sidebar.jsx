import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">📚 LMS</h2>

      <ul className="menu">
        <li>
          <Link to="/dashboard">🏠 Dashboard</Link>
        </li>
        <li>
          <Link to="/books">📖 Books</Link>
        </li>
        <li>
          <Link to="/borrow">📥 Borrow Book</Link>
        </li>
        <li>
          <Link to="/return">🔁 Return Book</Link>
        </li>
        <li>
          <Link to="/users">👤 Users</Link>
        </li>
      </ul>

      <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;