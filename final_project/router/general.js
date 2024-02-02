const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesUserExist = (username) => {
  const found_users = users.filter((user) => user.username === username);
  return found_users.length > 0;
};

public_users.post("/register", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  username = req.body.username;
  password = req.body.password;

  if (username && password) {
    if (!doesUserExist(username)) {
      users.push({ username: username, password: password });
      return res.status(201).json({ message: "User successfully registered" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Bad request" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // return res.status(200).json(books);
  const getBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  });
  getBooksPromise.then((books) => res.status(200).json(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  // const book = books[req.params.isbn];
  // if (!book) {
  //   return res.status(404).send("Book not found");
  // }

  // return res.status(200).json(book);

  const getBookPromise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (!book) {
      reject("Book not found");
    } else {
      resolve(book);
    }
  });
  getBookPromise
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).send(err));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const getBookPromise = new Promise((resolve, reject) => {
    let found_books = [];
    Object.values(books).forEach(
      (b) => b.author === req.params.author && found_books.push(b)
    );

    if (found_books.length == 0) {
      reject("No books found");
    }

    resolve(found_books);
  });
  getBookPromise
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).send(err));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const getBookPromise = new Promise((resolve, reject) => {
    const found_books = [];
    Object.values(books).forEach(
      (b) => b.title === req.params.title && found_books.push(b)
    );

    if (found_books.length == 0) {
      reject("No books found");
    }

    resolve(found_books);
  });

  getBookPromise
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).send(err));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).send("Book not found");
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
