const express = require('express');
const router = express.Router();

const Book = require('../models/Book.model');





// GET route to display the form
router.get("/books/create", (req, res, next) => {
    res.render("books/book-create");
});

// POST route to save a new book to the database in the books collection
router.post("/books/create", (req, res, next) => {

    const newBook = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating
    };


    Book.create(newBook)
        .then( (newBook) => {
            res.redirect("/books");
        })
        .catch( e => {
            console.log("error creating new book", e);
            next(e);
        });
});

// GET route to display the form to update a specific book
router.get('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
   
    Book.findById(bookId)
      .then(bookToEdit => {
        // console.log(bookToEdit);
        res.render('books/book-edit.hbs', { book: bookToEdit }); // <-- add this line
      })
      .catch(error => next(error));
  });

// POST route to actually make updates on a specific book
router.post('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
    const { title, description, author, rating } = req.body;
   
    Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
      .then(updatedBook => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
      .catch(error => next(error));
  });

// POST route to delete a book from the database
router.post('/books/:bookId/delete', (req, res, next) => {
    const { bookId } = req.params;
   
    Book.findByIdAndDelete(bookId)
      .then(() => res.redirect('/books'))
      .catch(error => next(error));
  });

// GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
    Book.find()
        .then( (booksFromDB) => {

            const data = {
                books: booksFromDB
            }

            res.render("books/books-list", data);
        })
        .catch( e => {
            console.log("error getting list of books from DB", e);
            next(e);
        });
});

// GET route to retrieve and display details of a specific book
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;

    Book.findById(id)
        .then( bookFromDB => {
            res.render("books/book-details", bookFromDB);
        })
        .catch( e => {
            console.log("error getting book details from DB", e);
            next(e);
        });
});




module.exports = router;
