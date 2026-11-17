import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../assets/api/axiosConfig";
import { getAllBooks } from "../services/bookService";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          loadDashboardStats(),
          loadBooks()
        ]);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await api.get("/dashboardStat");

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

const loadBooks = async () => {
    try {
        const response = await getAllBooks();

        console.log("Books received:", response);

        setBooks(response.bookList || []);

    } catch (error) {
        console.error("Error loading all books:", error);
    }
};

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <h1>Library Dashboard 📚</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="cards">
              <div className="card">
                <h3>Total Books</h3>
                <p>{stats.totalBooks}</p>
              </div>

              <div className="card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>

              <div className="card">
                <h3>Borrowed Books</h3>
                <p>{stats.borrowedBooks}</p>
              </div>

              <div className="card">
                <h3>Overdue Books</h3>
                <p>{stats.overdueBooks}</p>
              </div>
            </div>

            <h2 style={{ marginTop: "40px" }}>All Books</h2>

            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Status</th>
                  <th>Edition</th>
                </tr>
              </thead>

              <tbody>
                {books && books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id || book.bookUUID}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher || "N/A"}</td>
                      <td>{book.isbn}</td>
                      <td>{book.status || "AVAILABLE"}</td>
                      <td>{book.edition || "1st"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;