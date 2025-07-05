import express, { Application, Request, Response } from "express";
import cors from "cors"; 
import { booksRoutes } from "./app/controllers/book.controller";
import { errorHandler } from "./app/middlewares/errorHandler";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();

const corsOptions = {
  origin: [
    "https://library-management-client-sage.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))
app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Library Management API Server");
});

// Error handler middleware
app.use(errorHandler);

export default app;
