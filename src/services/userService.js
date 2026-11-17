import api from "../assets/api/axiosConfig";

// Fetch all registered users
export const getAllUsers = async (page = 0, size = 10) => {
    try {
        const response = await api.get("/getAllUsers", {
            params: {
                page: page,
                size: size
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
// Create a new library user
export const createUser = async (userData) => {
    try {
        const response = await api.post("/createUser", userData);

        return response.data;

    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};