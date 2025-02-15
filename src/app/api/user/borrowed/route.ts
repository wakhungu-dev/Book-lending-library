import { NextResponse } from "next/server";
import { mongoDbConnection } from "@/app/lib/mongoose/DbConnection";
import { Borrowing } from "@/models";

export async function GET(req: Request) {
  await mongoDbConnection();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const borrowedBooks = await Borrowing.find({ userId }).populate("bookId");

    console.log("Borrowed Books API Response:", borrowedBooks); // Debugging

    return NextResponse.json(Array.isArray(borrowedBooks) ? borrowedBooks : []);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}
