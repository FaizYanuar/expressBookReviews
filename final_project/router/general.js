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