# API Usage Documentation

## Table of Contents

- [Basic Setup](#basic-setup)
- [Making API Calls](#making-api-calls)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Basic Setup

First, import the API configuration in your component:

```javascript
import api from "../config/AxiosConfig";
```

## Making API Calls

### GET Request

```javascript
// Simple GET request
const getBooks = async () => {
  try {
    const response = await api.get("/books");
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// GET with query parameters
const searchBooks = async (searchTerm, page = 1, limit = 10) => {
  try {
    const response = await api.get("/books/search", {
      search: searchTerm,
      page: page,
      limit: limit,
    });
    return response;
  } catch (error) {
    console.error("Error searching books:", error);
  }
};
```

### POST Request

```javascript
// Create new resource
const createBook = async (bookData) => {
  try {
    const response = await api.post("/books", bookData);
    return response;
  } catch (error) {
    console.error("Error creating book:", error);
  }
};

// Login example
const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    // Store token
    localStorage.setItem("token", response.token);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### PUT Request

```javascript
// Update entire resource
const updateBook = async (bookId, bookData) => {
  try {
    const response = await api.put(`/books/${bookId}`, bookData);
    return response;
  } catch (error) {
    console.error("Error updating book:", error);
  }
};
```

### PATCH Request

```javascript
// Update partial resource
const updateBookStatus = async (bookId, status) => {
  try {
    const response = await api.patch(`/books/${bookId}`, {
      status: status,
    });
    return response;
  } catch (error) {
    console.error("Error updating book status:", error);
  }
};
```

### DELETE Request

```javascript
// Delete resource
const deleteBook = async (bookId) => {
  try {
    const response = await api.delete(`/books/${bookId}`);
    return response;
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};
```

## Error Handling

The API configuration automatically handles common errors:

- **401 Unauthorized**: Redirects to login page
- **403 Forbidden**: Access denied errors
- **404 Not Found**: Resource not found
- **500 Server Error**: Internal server errors
- **Network Errors**: Connection issues

Custom error handling example:

```javascript
const getBookDetails = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          // Handle book not found
          return { error: "Book not found" };
        case 403:
          // Handle forbidden access
          return { error: "Access denied" };
        default:
          return { error: "An error occurred" };
      }
    }
    return { error: "Network error" };
  }
};
```

## Examples

### Complete Component Example

```javascript
import React, { useState, useEffect } from "react";
import api from "../config/AxiosConfig";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await api.get("/books");
        setBooks(response);
        setError(null);
      } catch (error) {
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Add new book
  const handleAddBook = async (bookData) => {
    try {
      const response = await api.post("/books", bookData);
      setBooks([...books, response]);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to add book" };
    }
  };

  // Update book
  const handleUpdateBook = async (bookId, bookData) => {
    try {
      const response = await api.put(`/books/${bookId}`, bookData);
      setBooks(books.map((book) => (book.id === bookId ? response : book)));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update book" };
    }
  };

  // Delete book
  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete book" };
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render your books list */}</div>;
};

export default BookList;
```

### Authentication Example

```javascript
const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      return null;
    }
  },
};
```

Remember:

- The API automatically handles authentication tokens
- All requests automatically use the correct base URL for your environment
- Error handling is built-in but can be overridden
- Response data is automatically extracted from the axios response
