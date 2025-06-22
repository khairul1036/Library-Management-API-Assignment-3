import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

//if book copy's are 0 then set book available to false
Book.schema.statics.updateAvailability = async function (bookId: string) {
    const book = await this.findById(bookId);
    if (!book) return;

    if (book.copies === 0) {
        book.available = false;
        await book.save();
    }
};


//Borrow a Book
borrowRoutes.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { book: bookId, quantity, dueDate } = req.body;

            //if any input missing then send this error
            if (!bookId || !quantity || !dueDate) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    error: 'book, quantity, and dueDate are required',
                });
                return;
            }

            //if book not found by id then send this error
            const book = await Book.findById(bookId);
            if (!book) {
                res.status(404).json({
                    success: false,
                    message: 'Book not found',
                    data: null,
                });
                return;
            }

            //if book copy are not available then send this error
            if (!book.available || book.copies < quantity) {
                res.status(400).json({
                    success: false,
                    message: 'Not enough copies available',
                    data: null,
                });
                return;
            }

            //if top of all conditions are pass then update book copies and save it
            book.copies -= quantity;
            await book.save();

            // call updateAvailability function by book id to see the number of book is 0.
            await Book.updateAvailability(bookId);

            //borrow record are added
            const borrowRecord = await Borrow.create({
                book: bookId,
                quantity,
                dueDate,
            });

            //success message if all are ok
            res.status(201).json({
                success: true,
                message: 'Book borrowed successfully',
                data: borrowRecord,
            });
        } catch (error) {
            //if there is any other error then send it to the next error
            next(error);
        }
    }
);

