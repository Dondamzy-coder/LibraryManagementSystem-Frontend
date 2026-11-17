import api from "../assets/api/axiosConfig";

export const getAvailableBooks = async () => {
    const response = await api.get("/viewAvailableBooks");

    console.log("RESPONSE DATA:", response.data);

    return response.data.data;
};
export const searchBooks = async (keyword) => {
  const response = await api.get("/searchBook", {
    params: {
      keyword: keyword,
    },
  });

  return response.data.data;
};
export const updateBook = async (id, bookData) => {
    const response = await api.put(`/updateBookById/${id}`, bookData);

    return response.data;
};

export const deleteBook = async (id) => {
    const response = await api.delete(`/deleteBookById/${id}`);
    return response.data;
};


export const createBook = async (bookData) => {
  const response = await api.post("/createBook", bookData);

  return response.data;
};
export const borrowBook = async (bookId, userId) => {
    const response = await api.post(
        `/borrowBookById/${bookId}/${userId}`
    );

    return response.data;
};
export const getAllBooks = async () => {
    const response = await api.get("/viewAllBooks");

    console.log("All books response:", response.data);

    return response.data;
};