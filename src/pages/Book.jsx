import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAvailableBooks,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook
} from "../services/bookService";
import "./Book.css";

function Book() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editBookForm, setEditBookForm] = useState({});

  const [bookForm, setBookForm] = useState({
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  status: "AVAILABLE",
  userId: "",
  libraryCategoryId: "",
  libraryName: "",
  edition: "",
});
const handleInputChange = (e) => {
  const { name, value } = e.target;

  setBookForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleAddBook = async (e) => {
  e.preventDefault();

  if (submitting) return;

  setSubmitting(true);

  try {
    const bookData = {
      ...bookForm,
      userId: Number(bookForm.userId),
      libraryCategoryId: Number(bookForm.libraryCategoryId),
    };

    console.log("Creating book:", bookData);

    const response = await createBook(bookData);

    console.log("Create book response:", response);

    if (response?.statusCode === 200) {
      alert("Book created successfully!");

      setShowAddBook(false);

      setBookForm({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        status: "AVAILABLE",
        userId: "",
        libraryCategoryId: "",
        libraryName: "",
        edition: "",
      });

      await loadBooks();
    } else {
      alert(response?.message || "Failed to create book.");
    }
  } catch (error) {
    console.error("Error creating book:", error);

    alert(
      error.response?.data?.message ||
      "Failed to create book. Please check the details and try again."
    );
  } finally {
    setSubmitting(false);
  }
};

const loadBooks = async () => {
    console.log("Book page: Starting to load books");

    try {
        setLoading(true);

        const books = await getAvailableBooks();

        console.log("Book page: Books received:", books);
        console.log("Book page: Is array?", Array.isArray(books));

        setBooks(Array.isArray(books) ? books : []);

    } catch (error) {
        console.error("Book page: Error loading books:", error);
    } finally {
        console.log("Book page: Setting loading to false");
        setLoading(false);
    }
};
useEffect(() => {
    loadBooks();
}, []);

const handleSaveChanges = async () => {
    try {
        const response = await updateBook(
            editBookForm.id,
            editBookForm
        );

        console.log("Update response:", response);
        console.log("Book data submitted:", editBookForm);

        alert("Book updated successfully!");

        setShowEditModal(false);

        await loadBooks();

    } catch (error) {
        console.error(
            "Error updating book:",
            error.response?.data || error.message
        );

        alert("Failed to update book. Please try again.");
    }
};

const handleDeleteBook = async (book) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
        `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await deleteBook(book.id);

        console.log("Delete response:", response);

        // Check the response returned by your backend
        if (response.statusCode === 200) {
            alert("Book deleted successfully!");
            await loadBooks();
        } else {
            alert(response.message || "Failed to delete book.");
        }
    } catch (error) {
        console.error(
            "Error deleting book:",
            error.response?.data || error.message
        );

        alert("Failed to delete book. Please try again.");
    }
};
const handleBorrowBook = async (book) => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        alert("Unable to identify the logged-in student. Please log in again.");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to borrow "${book.title}"?`
    );

    if (!confirmed) return;

    try {
        const response = await borrowBook(book.id, user.id);

        console.log("Borrow response:", response);

        if (response.statusCode === 200) {

            alert("Book borrowed successfully!");

            await loadBooks();

        } else {

            alert(response.message || "Unable to borrow book.");

        }

    } catch (error) {

        console.error(
            "Error borrowing book:",
            error.response?.data || error.message
        );

        alert(
            error.response?.data?.message ||
            "Something went wrong while borrowing the book."
        );
    }
};


  const handleSearch = async () => {
  try {
    if (!searchKeyword.trim()) {
      await loadBooks();
      return;
    }

    setLoading(true);

    const results = await searchBooks(searchKeyword.trim());

    console.log("Search results:", results);

    setBooks(Array.isArray(results) ? results : []);
  } catch (error) {
    console.error("Error searching books:", error);
    setBooks([]);
  } finally {
    setLoading(false);
  }
};
  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
};
const handleEditBook = (book) => {
    setEditBookForm({ ...book });
    setShowEditModal(true);
};
  return (
    <div className="book-page-container">
      <Sidebar />

      <main className="book-main-content">

        {/* PAGE HEADER */}
        <div className="book-header">
          <div>
            <h1>Books</h1>
            <p>Manage and view library books</p>
          </div>

          <button
    type="button"
    className="add-book-btn"
    onClick={() => setShowAddBook(true)}
>
    + Add Book
</button>
        </div>

        {/* SEARCH */}
        <div className="book-toolbar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* BOOK TABLE */}
        {loading ? (
          <p className="loading-text">Loading books...</p>
        ) : (
          <div className="books-table-container">
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Edition</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id || book.bookUUID}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher || "N/A"}</td>
                      <td>{book.isbn || "N/A"}</td>
                      <td>{book.edition || "N/A"}</td>

                      <td>
                        <span
                          className={`book-status ${
                            book.status?.toLowerCase() || "available"
                          }`}
                        >
                          {book.status || "AVAILABLE"}
                        </span>
                      </td>

                      <td>
    <button onClick={() => handleViewBook(book)}>
        View
    </button>

    <button onClick={() => handleEditBook(book)}>
        Edit
    </button>

    <button onClick={() => handleDeleteBook(book)}>
        Delete
    </button>

    {book.status === "AVAILABLE" && (
        <button
            onClick={() => handleBorrowBook(book)}
            className="borrow-btn"
        >
            Borrow
        </button>
    )}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-books">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {showViewModal && selectedBook && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>Book Details</h2>

            <p>
                <strong>Title:</strong> {selectedBook.title}
            </p>

            <p>
                <strong>Author:</strong> {selectedBook.author}
            </p>

            <p>
                <strong>Publisher:</strong> {selectedBook.publisher}
            </p>

            <p>
                <strong>ISBN:</strong> {selectedBook.isbn}
            </p>

            <p>
                <strong>Edition:</strong> {selectedBook.edition}
            </p>

            <p>
                <strong>Status:</strong> {selectedBook.status}
            </p>

            <button
                onClick={() => setShowViewModal(false)}
            >
                Close
            </button>
        </div>
    </div>
)}
{showEditModal && (
    <div className="modal-overlay">
        <div className="modal-content">

            <h2>Edit Book</h2>

            <form>
                <label>Title</label>
                <input
                    type="text"
                    value={editBookForm.title || ""}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            title: e.target.value
                        })
                    }
                />

                <label>Author</label>
                <input
                    type="text"
                    value={editBookForm.author || ""}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            author: e.target.value
                        })
                    }
                />

                <label>Publisher</label>
                <input
                    type="text"
                    value={editBookForm.publisher || ""}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            publisher: e.target.value
                        })
                    }
                />

                <label>ISBN</label>
                <input
                    type="text"
                    value={editBookForm.isbn || ""}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            isbn: e.target.value
                        })
                    }
                />

                <label>Edition</label>
                <input
                    type="text"
                    value={editBookForm.edition || ""}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            edition: e.target.value
                        })
                    }
                />

                <label>Status</label>
                <select
                    value={editBookForm.status || "AVAILABLE"}
                    onChange={(e) =>
                        setEditBookForm({
                            ...editBookForm,
                            status: e.target.value
                        })
                    }
                >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="BORROWED">BORROWED</option>
                </select>

                <br />
                <br />

                <button
    type="button"
    onClick={handleSaveChanges}
>
    Save Changes
</button>
                <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                >
                    Cancel
                </button>

            </form>

        </div>
    </div>
)}
          </div>
        )}

        {/* ADD BOOK MODAL */}
        {showAddBook && (
          <div className="modal-overlay">
            <div className="modal">

              <div className="modal-header">
                <h2>Add New Book</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowAddBook(false)}
                >
                  ×
                </button>
              </div>

             <form onSubmit={handleAddBook}>

                {/* TITLE */}
                <div className="form-group">
                  <label>Title</label>

                  <input
                     type="text"
                     name="title"
                    placeholder="Enter book title"
                     value={bookForm.title}
                      onChange={handleInputChange}
  required
/>
                </div>


                {/* AUTHOR */}
                <div className="form-group">
                  <label>Author</label>

                  <input
    type="text"
    name="author"
    placeholder="Enter author name"
    value={bookForm.author}
    onChange={handleInputChange}
    required
/>

                </div>

                {/* PUBLISHER */}
                <div className="form-group">
                  <label>Publisher</label>

                  <input
                   type="text"
                    name="publisher"
                      placeholder="Enter publisher"
                        value={bookForm.publisher}
                          onChange={handleInputChange}
                          />
                </div>

                {/* ISBN */}
                <div className="form-group">
                  <label>ISBN</label>

                  <input
  type="text"
  name="isbn"
  placeholder="Enter ISBN"
  value={bookForm.isbn}
  onChange={handleInputChange}
/>
                </div>

                {/* EDITION */}
                <div className="form-group">
                  <label>Edition</label>

                  <input
  type="text"
  name="edition"
  placeholder="Enter edition"
  value={bookForm.edition}
  onChange={handleInputChange}
/>
                </div>

                {/* STATUS */}
                <div className="form-group">
                  <label>Status</label>

                  <select
  name="status"
  value={bookForm.status}
  onChange={handleInputChange}
>
  <option value="AVAILABLE">AVAILABLE</option>
  <option value="RESERVED">RESERVED</option>
</select>
                </div>

                {/* LIBRARY NAME */}
                <div className="form-group">
                  <label>Library Name</label>

                  <input
  type="text"
  name="libraryName"
  placeholder="Enter library name"
  value={bookForm.libraryName}
  onChange={handleInputChange}
/>
                </div>

                {/* CATEGORY ID */}
                <div className="form-group">
                  <label>Category ID</label>

                  <input
  type="number"
  name="libraryCategoryId"
  placeholder="Enter category ID"
  value={bookForm.libraryCategoryId}
  onChange={handleInputChange}
/>
                </div>

                {/* USER ID */}
                <div className="form-group">
                  <label>User ID</label>

                 <input
                  type="number"
                  name="userId"
                  placeholder="Enter user ID"
                  value={bookForm.userId}
                  onChange={handleInputChange}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="submit-book-btn"
                >
                  Add Book
                </button>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Book;