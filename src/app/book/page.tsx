"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Books() {
  interface Book {
    _id: string;
    title: string;
    author: string;
    available: boolean;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState("65cd5b3a9f1c3a1d4b3e7e2d"); // Example user ID (Replace with real user data)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/book');
        if (!res.ok) throw new Error(`Error fetching books: ${res.statusText}`);

        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const borrowBook = async (bookId: string) => {
    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bookId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to borrow book');

      alert('Book borrowed successfully!');
      setBooks(books.map(book => book._id === bookId ? { ...book, available: false } : book));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error borrowing book');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Available Books</h1>

      {loading && <p className="text-gray-500">Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && books.length === 0 && <p className="text-gray-500">No books available.</p>}

      <ul className="mt-4">
        {books.map((book: Book) => (
          <li key={book._id} className="border p-2 rounded mb-2">
            <Link href={`/books/${book._id}`} className="text-blue-500">
              {book.title} by {book.author}
            </Link>
            <p className={`text-sm ${book.available ? 'text-green-500' : 'text-red-500'}`}>
              {book.available ? 'Available' : 'Not Available'}
            </p>
            <button
              onClick={() => borrowBook(book._id)}
              disabled={!book.available}
              className={`mt-2 px-4 py-2 text-white rounded ${book.available ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {book.available ? 'Borrow' : 'Unavailable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
