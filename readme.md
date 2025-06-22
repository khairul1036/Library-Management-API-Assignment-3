# Library Management System API

A robust **Library Management System** built with **Express**, **TypeScript**, and **MongoDB (via Mongoose)**. This API provides endpoints to manage books, handle borrowing operations, and generate summaries using MongoDB aggregation pipelines. It includes schema validation, business logic enforcement, Mongoose middleware, and custom methods for efficient library operations.

## ✨ Features

- **Book Management**:
  - Create, retrieve, update, and delete books with proper validation.
  - Filter books by genre, sort by creation date, and limit results.
  - Unique ISBN enforcement and genre validation (`FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`).
- **Borrow Operations**:
  - Borrow books with availability checks and quantity deduction.
  - Automatic availability toggle when copies reach zero using a Mongoose instance method.
  - Due date validation for borrow records.
- **Aggregation Pipeline**:
  - Generate a summary of borrowed books with total quantities and book details (title, ISBN).
- **Mongoose Enhancements**:
  - Pre-save middleware to ensure data consistency.
  - Post-save middleware for logging or additional operations.
  - Custom instance/static methods for business logic (e.g., availability updates).
- **Error Handling**:
  - Centralized error middleware for consistent error responses.
  - Detailed validation error messages for invalid inputs.
  - Proper handling of 404s and server errors.
- **TypeScript**:
  - Strongly typed interfaces for books and borrow records.
  - Type-safe controllers and middleware.
- **Code Quality**:
  - Modular project structure with separated concerns (controllers, models, interfaces).
  - Meaningful variable names and consistent formatting.
  - ESLint and Prettier for code linting and formatting.

## 📁 Project Structure

```
📦 src
┣ 📂 app
┃ ┣ 📂 controllers
┃ ┃ ┣ 📜 books.controller.ts     # Route handlers for books
┃ ┃ ┗ 📜 borrow.controller.ts    # Route handlers for borrow logic
┃ ┣ 📂 middlewares
┃ ┃ ┗ 📜 errorHandler.ts         # Centralized error handling middleware
┃ ┣ 📂 models
┃ ┃ ┣ 📜 book.model.ts           # Mongoose schema for Book
┃ ┃ ┗ 📜 borrow.model.ts         # Mongoose schema for Borrow
┃ ┗ 📂 interfaces
┃ ┃ ┣ 📜 book.interfaces.ts      # TypeScript interfaces for Book
┃ ┃ ┗ 📜 borrow.interfaces.ts    # TypeScript interfaces for Borrow
┣ 📂 config
┃ ┗ 📜 index.ts                  # MongoDB connection and config
┣ 📜 app.ts                      # Express app instance and middleware setup
┣ 📜 server.ts                   # Main entry point (app.listen)
```

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local or MongoDB Atlas)
- **npm** or **yarn**
- **TypeScript** (Globally installed or via `npx`)

## 🚀 Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/khairul1036/Library-Management-API-Assignment-3.git
   cd library-management-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=3000
   DB_USER=Your MongoDB User Name
   DB_PASS=Your MongoDB User Password
   ```
   - Replace with your MongoDB connection string.

4. **Build the Project**:
   Compile TypeScript to JavaScript:
   ```bash
   npm run build
   ```

5. **Start the Server**:
   Run the application in production mode:
   ```bash
   npm start
   ```
   Or, for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the API**:
   The API will be available at `http://localhost:3000/api`.

## 📚 API Endpoints

### Books

- **POST /api/books**  
  Create a new book.  
  **Request Body**: `{ title, author, genre, isbn, description?, copies, available? }`  
  **Response**: Book object with success message.  
  **Sample Request**:
  ```json
  {
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true
  }
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Book created successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

- **GET /api/books**  
  Retrieve all books with optional filtering and sorting.  
  **Query Params**: `filter` (genre), `sortBy` (createdAt), `sort` (asc/desc), `limit` (number)  
  **Response**: Array of book objects.  
  **Sample Request**:
  ```
  GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Books retrieved successfully",
    "data": [
      {
        "_id": "64f123abc4567890def12345",
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true,
        "createdAt": "2024-11-19T10:23:45.123Z",
        "updatedAt": "2024-11-19T10:23:45.123Z"
      }
    ]
  }
  ```

- **GET /api/books/:bookId**  
  Retrieve a book by ID.  
  **Response**: Book object.  
  **Sample Request**:
  ```
  GET /api/books/64f123abc4567890def12345
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Book retrieved successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

- **PUT /api/books/:bookId**  
  Update book details.  
  **Request Body**: Partial book object (e.g., `{ copies: 50 }`)  
  **Response**: Updated book object.  
  **Sample Request**:
  ```json
  {
    "copies": 50
  }
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Book updated successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 50,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-20T08:30:00.000Z"
    }
  }
  ```

- **DELETE /api/books/:bookId**  
  Delete a book by ID.  
  **Response**: Success message with null data.  
  **Sample Request**:
  ```
  DELETE /api/books/64f123abc4567890def12345
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Book deleted successfully",
    "data": null
  }
  ```

### Borrow

- **POST /api/borrow**  
  Borrow a book with quantity and due date.  
  **Request Body**: `{ book, quantity, dueDate }`  
  **Response**: Borrow record with success message.  
  **Sample Request**:
  ```json
  {
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z"
  }
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Book borrowed successfully",
    "data": {
      "_id": "64bc4a0f9e1c2d3f4b5a6789",
      "book": "64ab3f9e2a4b5c6d7e8f9012",
      "quantity": 2,
      "dueDate": "2025-07-18T00:00:00.000Z",
      "createdAt": "2025-06-18T07:12:15.123Z",
      "updatedAt": "2025-06-18T07:12:15.123Z"
    }
  }
  ```

- **GET /api/borrow**  
  Get a summary of borrowed books using aggregation.  
  **Response**: Array of objects with book details and total borrowed quantity.  
  **Sample Request**:
  ```
  GET /api/borrow
  ```
  **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
      {
        "book": {
          "title": "The Theory of Everything",
          "isbn": "9780553380163"
        },
        "totalQuantity": 5
      },
      {
        "book": {
          "title": "1984",
          "isbn": "9780451524935"
        },
        "totalQuantity": 3
      }
    ]
  }
  ```

## 🧪 Testing the API

1. Use **Postman** or **cURL** to test the endpoints.
2. Example request to create a book:
   ```bash
   curl -X POST http://localhost:3000/api/books \
     -H "Content-Type: application/json" \
     -d '{
       "title": "The Theory of Everything",
       "author": "Stephen Hawking",
       "genre": "SCIENCE",
       "isbn": "9780553380163",
       "description": "An overview of cosmology and black holes.",
       "copies": 5,
       "available": true
     }'
   ```

## 📝 Notes

- Ensure MongoDB is running before starting the server.
- The API enforces strict validation (e.g., positive copies, valid genres).
- Error responses follow a consistent format with `success: false`, `message`, and `error` fields.
- The aggregation pipeline for `/api/borrow` efficiently groups and summarizes borrow data.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## 📜 License

This project is licensed under the MIT License.

## 📬 Contact

For queries or feedback, reach out via me.