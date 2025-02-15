import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    available: { type: Boolean, default: true }
}, { timestamps: true });

const BorrowingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    dueDate: { type: Date, required: true }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
export const Borrowing = mongoose.models.Borrowing || mongoose.model('Borrowing', BorrowingSchema);