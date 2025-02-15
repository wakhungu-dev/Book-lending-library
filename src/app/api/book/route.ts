import { mongoDbConnection } from '@/app/lib/mongoose/DbConnection';
import { Book } from '@/models';
import { NextResponse } from 'next/server';

// ✅ GET All Books (With Pagination)
export async function GET(request: Request) {
    await mongoDbConnection();
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10'); // Default limit = 10
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        const books = await Book.find().limit(limit).skip(skip);
        
        return NextResponse.json(books);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch books: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

// ✅ GET a Single Book by ID
export async function GET_BY_ID(request: Request) {
    await mongoDbConnection();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        const book = await Book.findById(id);
        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(book);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch book: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

// ✅ POST (Create a New Book)
export async function POST(request: Request) {
    await mongoDbConnection();
    try {
        const { title, author, isbn, available } = await request.json();

        if (!title || !author || !isbn) {
            return NextResponse.json({ error: 'All fields (title, author, isbn) are required' }, { status: 400 });
        }

        const newBook = new Book({
            title,
            author,
            isbn,
            available: available ?? true // Default to true if not provided
        });

        await newBook.save();

        return NextResponse.json({ message: 'Book added successfully', book: newBook }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to add book: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

// ✅ PUT (Update a Book)
export async function PUT(request: Request) {
    await mongoDbConnection();
    try {
        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBook) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to update book: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

// ✅ DELETE (Remove a Book)
export async function DELETE(request: Request) {
    await mongoDbConnection();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Book deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to delete book: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
