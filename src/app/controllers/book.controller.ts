import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/book.model";

export const booksRoutes = express.Router();


// Create a book
booksRoutes.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate ISBN error
      res.status(400).json({
        success: false,
        message: "Duplicate entry",
        error: `A book with the ISBN '${req.body.isbn}' already exists.`,
      });
    } else {
      // Forward other errors to global error handler
      next(error);
    }
  }
});


// Get all books with optional filter, sorting, and limit
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      filter,
      sortBy = 'createdAt',
      sort = 'desc',
      limit = '10',
    } = req.query;

    const query: Record<string, any> = {};
    if (filter) {
      query.genre = filter;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
});