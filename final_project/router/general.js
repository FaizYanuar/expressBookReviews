const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Helper function to simulate an async database call
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Resolves with the books object after 500ms
    }, 500);
  });
};

// Simulate an async database check to see if a user exists
const checkUserExistsAsync = (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let userswithsamename = users.filter((user) => user.username === username);
      resolve(userswithsamename.length > 0); // Resolves true if they exist, false if they don't
    }, 300); // 300ms simulated delay
  });
};

// Simulate an async database save operation
const saveUserAsync = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      users.push({ "username": username, "password": password });
      resolve(); // Resolves when saving is complete
    }, 300);
  });
};

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => user.username === username);
  
  // If the array has items, the user exists (return true). Otherwise, return false.
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    try {
      // 1. Await the database check
      const userExists = await checkUserExistsAsync(username);

      if (!userExists) {
        // 2. Await the database save
        await saveUserAsync(username, password);
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(409).json({ message: "User already exists!" }); // 409 is the standard code for this
      }
    } catch (error) {
      return res.status(500).json({ message: "An internal server error occurred." });
    }
  }
  
  // Return error if username or password is missing
  return res.status(400).json({ message: "Unable to register user. Missing username or password." });
});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // 1. Wait for the "database" to return the books
    const allBooks = await getBooksAsync(); 
    
    // 2. Send the response
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // 1. Await the books data
    const allBooks = await getBooksAsync();
    
    // 2. Find the specific book
    const book = allBooks[isbn];

    // 3. Send response
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
  const author = req.params.author;
  // 1. Convert the books object into an array of its inner book objects
  const allBooks = await getBooksAsync();

  // 2. Now you can safely use .filter() on the array
  let filtered_books = allBooks.filter((book) => book.author === author);

  // 3. Send the matching books back to the client
  if (filtered_books.length > 0) {
    res.json(filtered_books);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  };
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  // 1. Convert the books object into an array of its inner book objects
  const allBooks = await getBooksAsync();

  // 2. Now you can safely use .filter() on the array
  let filtered_books = allBooks.filter((book) => book.title === title);

  // 3. Send the matching books back to the client
  if (filtered_books.length > 0) {
    res.json(filtered_books);
  } else {
    res.status(404).json({ message: "No books found for this title" });
  };
});

//  Get book review
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
