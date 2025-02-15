"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [userId, setUserId] = useState(""); // Store logged-in user ID

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    getUserId(); // Get user ID from session/local storage
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/book");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const res = await fetch("/api/user/borrowed");
      const data = await res.json();
      setBorrowedBooks(data);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  const getUserId = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
    }
  };

  const borrowBook = async (bookId: string) => {
    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId }),
      });

      if (!res.ok) throw new Error("Borrowing failed");

      alert("Book borrowed successfully!");
      fetchBooks();
      fetchBorrowedBooks();
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

 const handleReturn = async (id: string) => {
  try {
    const res = await fetch(`/api/return/${id}`, { method: "POST" });
    if (res.ok) {
      setBorrowedBooks(borrowedBooks.filter(book => book._id !== id));
    } else {
      console.error("Failed to return book:", await res.json());
    }
  } catch (error) {
    console.error("Error returning book:", error);
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800">Dashboard</h1>

      {/* Available Books */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Available Books 📚</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {books.map((book: any) => (
            <li key={book._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold">{book.title}</p>
              <p className="text-gray-600">by {book.author}</p>
              {book.available && (
                <button
                  onClick={() => borrowBook(book._id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Borrow
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Borrowed Books */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Borrowed Books 🏷️</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {borrowedBooks.map((borrow: any) => (
            <li key={borrow._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold">{borrow.book.title}</p>
              <p className="text-gray-600">by {borrow.book.author}</p>
              <button
                onClick={() => returnBook(borrow._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Return
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
