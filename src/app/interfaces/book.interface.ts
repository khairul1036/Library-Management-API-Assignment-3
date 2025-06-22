import { Document, Model } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookModel extends Model<IBook> {
  updateAvailability(bookId: string): Promise<void>;
}
