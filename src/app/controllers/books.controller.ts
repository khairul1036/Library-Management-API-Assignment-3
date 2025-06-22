import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

export const booksRoutes = express.Router();

// Get all books (with optional filters: genre, available)
booksRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    const { genre, available } = req.query;

    if (genre) filters.genre = genre;
    if (available !== undefined) filters.available = available === 'true';

    const books = await Book.find(filters);

    res.status(200).json({
      success: true,
      message: "All books retrieved successfully",
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error
    });
  }
});

// Create a new book
booksRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error
    });
  }
});
