import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/book.model";

export const booksRoutes = express.Router();

// Create a book
booksRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  }
);

// Get all books with optional filter, sorting, and limit
booksRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        filter,
        sortBy = "createdAt",
        sort = "desc",
        limit = "10",
      } = req.query;

      const query: Record<string, any> = {};
      if (filter) {
        query.genre = filter;
      }

      const sortOrder = sort === "asc" ? 1 : -1;
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
  }
);

//get a single book by id
booksRoutes.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findById(req.params.bookId);

      res.status(book ? 200 : 404).json({
        success: !!book,
        message: book ? "Book retrieved successfully" : "Book not found",
        data: book || null,
      });
    } catch (error) {
      next(error);
    }
  }
);

// update book by id
booksRoutes.put("/:bookId",async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateData = { ...req.body };

      // Automatically set availability based on the number of copies
      if (typeof updateData.copies === "number") {
        updateData.available = updateData.copies > 0;
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.bookId,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(updatedBook ? 200 : 404).json({
        success: !!updatedBook,
        message: updatedBook ? "Book updated successfully" : "Book not found",
        data: updatedBook || null,
      });
    } catch (error) {
      next(error);
    }
  }
);

//delete book by id
booksRoutes.delete("/:bookId", async (req: Request, res: Response, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.bookId);

    res.status(deletedBook ? 200 : 404).json({
      success: !!deletedBook,
      message: deletedBook ? "Book deleted successfully" : "Book not found",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});
