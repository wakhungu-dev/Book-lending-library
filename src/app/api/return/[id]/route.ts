import { mongoDbConnection } from '@/app/lib/mongoose/DbConnection';
import { Borrowing, Book } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    await mongoDbConnection();

    try {
        const { id } = params; // The Borrowing ID
        const borrowingRecord = await Borrowing.findById(id);

        if (!borrowingRecord) {
            return NextResponse.json({ error: 'Borrowing record not found' }, { status: 404 });
        }

        // Mark the book as available
        await Book.findByIdAndUpdate(borrowingRecord.bookId, { available: true });

        // Delete the borrowing record
        await Borrowing.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Book returned successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to return book' }, { status: 500 });
    }
}
