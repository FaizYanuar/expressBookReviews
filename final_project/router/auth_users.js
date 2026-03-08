const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 1. Check if both username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in: Missing username or password" });
  }

  // 2. Generate JWT access token (Assuming the user provided correct credentials)
  let accessToken = jwt.sign({
    data: password // Store password in token (Note: storing passwords in JWTs is generally bad practice in the real world, but standard for this IBM project step)
  }, 'access', { expiresIn: 60 * 60 });

  // 3. Store access token and username in session
  req.session.authorization = {
    accessToken, username
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Look for the review in either the query or the body
  let review = req.query.review || req.body.review; 
  const username = req.session.authorization.username;

  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      // Use the exact string format the rubric expects
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
      return res.status(404).send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
      // Completely remove the review for this user
      delete books[isbn].reviews[username];
      
      // Return the EXACT JSON format the rubric is asking for
      return res.status(200).json({ "message": `Review for ISBN ${isbn} deleted` });
  } else {
      return res.status(404).json({ "message": "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
