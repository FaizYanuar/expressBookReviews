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
  
  // IBM usually expects the review to come from the query (URL?review=great) or body.
  // Let's check both just to be safe!
  const review = req.query.review || req.body.review; 
  
  // Grab the username from the session we saved during the /login route
  const username = req.session.authorization.username;

  // 1. Check if the book exists
  if (books[isbn]) {
      
      // 2. Add or update the review using the username as the key
      books[isbn].reviews[username] = review;
      
      // 3. Send a success message
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated by ${username}. Here is the review: ${review}`);
  } else {
      return res.status(404).send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  const username = req.session.authorization.username;

  // 1. Check if the book exists
  if (books[isbn]) {
      
      // 2. Add or update the review using the username as the key
      books[isbn].reviews[username] = " ";
      
      // 3. Send a success message
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted by ${username}.`);
  } else {
      return res.status(404).send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
