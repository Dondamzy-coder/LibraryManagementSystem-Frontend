import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Book from "./pages/Book";
import Users from "./pages/Users";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<Book />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;