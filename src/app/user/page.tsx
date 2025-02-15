"use client";
import { useEffect, useState } from "react";

interface BorrowedBook {
  _id: string;
  title: string;
  author: string;
  dueDate: string;
  returned?: boolean;
}

export default function Profile() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch("/api/user/borrowed/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token
          },
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setBorrowedBooks(data);
      } catch (err: any) {
        setError(err.message || "Failed to load borrowed books");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (bookId: string) => {
    try {
      const response = await fetch(`/api/return/${bookId}`, { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to return book");
      }

      setBorrowedBooks(borrowedBooks.filter((book) => book._id !== bookId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Your Borrowed Books
      </h1>

      {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}

      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}

      {!loading && borrowedBooks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          You haven’t borrowed any books.
        </p>
      )}

      <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {borrowedBooks.map((book) => (
          <li
            key={book._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold text-blue-600">{book.title}</p>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-gray-500">
              Due: {new Date(book.dueDate).toDateString()}
            </p>

            {!book.returned && (
              <button
                onClick={() => handleReturn(book._id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition"
              >
                Return Book
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
