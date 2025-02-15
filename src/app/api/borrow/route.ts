import { mongoDbConnection } from '@/app/lib/mongoose/DbConnection';
import { Borrowing, Book } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await mongoDbConnection();

    try {
        const { userId, bookId } = await request.json();

        if (!userId || !bookId) {
            return NextResponse.json({ error: 'User ID and Book ID are required' }, { status: 400 });
        }

        // Check if the book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        if (!book.available) {
            return NextResponse.json({ error: 'Book is already borrowed' }, { status: 400 });
        }

        // Set due date (default: 14 days from today)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Create the borrowing record
        const borrowing = new Borrowing({
            userId,
            bookId,
            dueDate
        });

        await borrowing.save();

        // Update book availability
        book.available = false;
        await book.save();

        return NextResponse.json({ message: 'Book borrowed successfully', borrowing }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: `Failed to borrow book: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
