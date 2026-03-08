const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ==========================================
// 1. ASYNC DATABASE HELPERS
// ==========================================
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 500);
  });
};

const checkUserExistsAsync = (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let userswithsamename = users.filter((user) => user.username === username);
      resolve(userswithsamename.length > 0);
    }, 300);
  });
};

const saveUserAsync = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      users.push({ "username": username, "password": password });
      resolve();
    }, 300);
  });
};

// ==========================================
// 2. EXPRESS API ROUTES (THE "KITCHEN")
// ==========================================

// Register a new user
public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const userExists = await checkUserExistsAsync(username);
      if (!userExists) {
        await saveUserAsync(username, password);
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(409).json({ message: "User already exists!" });
      }
    } catch (error) {
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Missing username or password." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getBooksAsync();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const allBooks = await getBooksAsync();
    const book = allBooks[isbn];

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const allBooks = await getBooksAsync();
    let booksArray = Object.values(allBooks);
    let filtered_books = booksArray.filter((book) => book.author === author);

    if (filtered_books.length > 0) {
      res.status(200).json(filtered_books);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const allBooks = await getBooksAsync();
    let booksArray = Object.values(allBooks);
    let filtered_books = booksArray.filter((book) => book.title === title);

    if (filtered_books.length > 0) {
      res.status(200).json(filtered_books);
    } else {
      res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;


// ==========================================
// 3. AXIOS CLIENT FUNCTIONS (THE "CUSTOMER" - Tasks 10-13)
// ==========================================

const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Task 10 - All Books:\n", response.data);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
};

const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Task 11 - Book with ISBN ${isbn}:\n`, response.data);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
};

const getBookByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Task 12 - Books by ${author}:\n`, response.data);
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
};

const getBookByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Task 13 - Books with title ${title}:\n`, response.data);
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
};