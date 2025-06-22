import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/book.controller";
import { errorHandler } from "./app/middlewares/errorHandler";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Library Management API Server");
});

// Error handler middleware
app.use(errorHandler);

export default app;
