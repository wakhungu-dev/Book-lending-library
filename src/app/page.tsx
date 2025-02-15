import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto text-center p-4">
      <h1 className="text-2xl font-bold">Welcome to the Book Library</h1>
      <p className="mt-4">Browse and borrow books with ease.</p>
      
      <div className="mt-6 flex justify-center gap-4">
        {/* View Books Link */}
        <Link href="/book" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Books
        </Link>

        {/* Register Link */}
        <Link href="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Register
        </Link>
      </div>

      <p className="mt-4">
        Already have an account?  
        <Link href="/login" className="text-blue-500 hover:underline ml-2">
          Login here
        </Link>
      </p>
    </div>
  );
}
