import React, { useEffect, useState } from "react";
import { getAllUsers, createUser } from "../services/userService";
import "./Users.css";

function Users() {

    // =========================
    // USER TABLE STATES
    // =========================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [pageSize] = useState(10);

    // =========================
    // ADD USER MODAL STATES
    // =========================

    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Stores the information entered into the form
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        username: "",
        password: "",
        libraryName: ""
    });

    // =========================
    // FETCH ALL USERS
    // =========================

    const loadUsers = async (page = 0) => {

        try {
            setLoading(true);
            setError("");

            const response = await getAllUsers(page, pageSize);

            if (response.statusCode === 200) {

                const userData = response.data;

                setUsers(userData.users || []);
                setCurrentPage(userData.currentPage);
                setTotalPages(userData.totalPages);
                setTotalElements(userData.totalElements);

            } else {
                setError(response.message || "Unable to retrieve users");
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Something went wrong while fetching users"
            );

        } finally {
            setLoading(false);
        }
    };

    // Load users when the page opens
    useEffect(() => {
        loadUsers(0);
    }, []);

    // =========================
    // HANDLE FORM INPUTS
    // =========================

    const handleNewUserChange = (e) => {

        const { name, value } = e.target;

        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    // =========================
    // CREATE NEW USER
    // =========================

    const handleCreateUser = async (e) => {

        e.preventDefault();

        try {

            setCreating(true);

            const response = await createUser(newUser);

            if (response.statusCode === 200) {

                alert("User created successfully!");

                // Clear form
                setNewUser({
                    firstName: "",
                    lastName: "",
                    emailAddress: "",
                    phoneNumber: "",
                    username: "",
                    password: "",
                    libraryName: ""
                });

                // Close modal
                setShowAddModal(false);

                // Refresh user table
                await loadUsers(0);

            } else {

                alert(response.message || "Unable to create user");

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong while creating user"
            );

        } finally {

            setCreating(false);

        }
    };

    // =========================
    // CLOSE ADD USER MODAL
    // =========================

    const closeAddModal = () => {

        setShowAddModal(false);

        setNewUser({
            firstName: "",
            lastName: "",
            emailAddress: "",
            phoneNumber: "",
            username: "",
            password: "",
            libraryName: ""
        });
    };

    // =========================
    // COMPONENT UI
    // =========================

    return (

        <div className="users-container">

            <h2>User Management</h2>

            <p>Manage registered library users.</p>

            {/* ADD USER BUTTON */}

            <button
                className="add-user-btn"
                onClick={() => setShowAddModal(true)}
            >
                + Add New User
            </button>


            {/* LOADING MESSAGE */}

            {loading && (
                <p className="users-loading">Loading users...</p>
            )}


            {/* ERROR MESSAGE */}

            {error && (
                <p className="error-message">{error}</p>
            )}


            {/* USERS TABLE */}

            {!loading && !error && (

                <>

                    <div className="users-table-container">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>Membership</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length > 0 ? (

                                    users.map((user) => (

                                        <tr key={user.id}>

                                            <td>{user.id}</td>

                                            <td>{user.firstName}</td>

                                            <td>{user.lastName ?? user.LastName}</td>

                                            <td>{user.userName ?? user.username}</td>

                                            <td>{user.emailAddress}</td>

                                            <td>{user.phoneNumber}</td>

                                            <td>
                                                <span className="membership-badge">
                                                    {user.userMembershipType}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="user-actions">

                                                    <button className="view-btn">
                                                        View
                                                    </button>

                                                    <button className="edit-btn">
                                                        Edit
                                                    </button>

                                                    <button className="delete-btn">
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="8">
                                            No users found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* PAGINATION */}

                    <div className="pagination">

                        <button
                            disabled={currentPage === 0}
                            onClick={() => loadUsers(currentPage - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {totalPages === 0 ? 0 : currentPage + 1}
                            {" "}of{" "}
                            {totalPages}
                        </span>

                        <button
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => loadUsers(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>


                    {/* TOTAL USERS */}

                    <p className="users-total">
                        Total registered users: {totalElements}
                    </p>

                </>

            )}


            {/* =========================
                ADD USER MODAL
            ========================= */}

            {showAddModal && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <h2>Add New User</h2>

                        <form onSubmit={handleCreateUser}>

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                value={newUser.firstName}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                value={newUser.lastName}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Email Address</label>

                            <input
                                type="email"
                                name="emailAddress"
                                value={newUser.emailAddress}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phoneNumber"
                                value={newUser.phoneNumber}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Username</label>

                            <input
                                type="text"
                                name="username"
                                value={newUser.username}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleNewUserChange}
                                required
                            />


                            <label>Library Name</label>

                            <input
                                type="text"
                                name="libraryName"
                                value={newUser.libraryName}
                                onChange={handleNewUserChange}
                                required
                            />


                            {/* FORM BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="submit"
                                    disabled={creating}
                                >
                                    {creating ? "Creating..." : "Create User"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Users;