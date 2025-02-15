import { useEffect, useState, JSX } from 'react';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
}

export default function Books(): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Available Books</h1>
      <ul className="mt-4">
        {books.map((book) => (
          <li key={book._id} className="border p-2 rounded mb-2">
            <Link href={`/books/${book._id}`} legacyBehavior>
              <a className="text-blue-500">{book.title} by {book.author}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
