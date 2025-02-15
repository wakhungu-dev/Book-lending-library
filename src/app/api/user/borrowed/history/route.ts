import { NextResponse } from "next/server";
import { mongoDbConnection } from "@/app/lib/mongoose/DbConnection";
import { Borrowing } from "@/models";
// import { getSessionUser } from "@/utils/auth";

export async function GET(request: Request) {
    await mongoDbConnection();

    try {
        const userId = await getSessionUser(request);
        if (!userId) {
            return NextResponse.json([], { status: 401 }); // Always return an array
        }

        const borrowedBooks = await Borrowing.find({ userId })
            .populate("bookId") //Ensure book details are included
            .lean();

        if (!borrowedBooks || !Array.isArray(borrowedBooks)) {
            return NextResponse.json([]); // Return empty array instead of undefined
        }

        const formattedBooks = borrowedBooks.map((borrow) => ({
            _id: borrow.bookId._id,
            title: borrow.bookId.title,
            author: borrow.bookId.author,
            dueDate: borrow.dueDate,
            returned: !borrow._id,
        }));

        return NextResponse.json(formattedBooks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch borrowing history" }, { status: 500 });
    }
}
