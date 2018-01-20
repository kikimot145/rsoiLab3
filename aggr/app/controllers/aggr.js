const express = require('express');
const router = express.Router();
const request = require('request');

const readersReq = require('../requests/readers_req');
const booksReq = require('../requests/books_req');
const authorsReq = require('../requests/authors_req');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/authors', (req, res, next) => {
	let page = req.query.page;
	let size = req.query.size;
	
	page  = (typeof(page) != 'undefined') ? page : 0;
	size = (typeof(size) != 'undefined') ? size : 20;
	
	console.log('***\n\n' + new Date() + ':\nGet all authors');
	
	authorsReq.getAuthors(page, size, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/authors/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet author ' + id);
	
	authorsReq.getAuthorById(id, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/books', (req, res, next) => {
	let author = req.query.author;
	let page  = req.query.page;
	let size = req.query.size;
	
	page  = (typeof(page) != 'undefined') ? page : 0;
	size = (typeof(size) != 'undefined') ? size : 20;
	
	console.log('***\n\n' + new Date() + ':\nGet all books with author ' + author);
	
	if (typeof(author) == 'undefined') {
		booksReq.getBooks(page, size, function (err, responseCode, body) {
			if (err)
				res.status(responseCode).send(JSON.parse(body));
			else {
				let books = JSON.parse(body);
				if (books.rows.length == 0) return res.status(responseCode).send(books);
				
				let cnt = 0;
				
				books.rows.forEach( function (item, index) {
					authorsReq.getAuthorById(item.authorId, function (err, responseCode, body) {
						books.rows[index].author = JSON.parse(body);
						delete books.rows[index].authorId;
						
						if (++cnt == books.rows.length) return res.status(responseCode).send(books);
					});
				});
			}
		});
	} else {
		booksReq.getBooksByAuthor(author, page, size, function (err, responseCode, body) {
			res.status(responseCode).send(JSON.parse(body));
		});
	}
	
});

router.get('/books/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet book ' + id);
	
	booksReq.getBookById(id, function (err, responseCode, body) {
		if (err)
			res.status(responseCode).send(JSON.parse(body));
		else {
			let book = JSON.parse(body);
			authorsReq.getAuthorById(book.authorId, function (err, responseCode, body) {
					book.author = JSON.parse(body);
					delete book.authorId;
					
					return res.status(responseCode).send(book);
			});
		}
	});
});


router.get('/readers/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet reader ' + id);
	
	readersReq.getReaderById(id, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.patch('/readers/:id/books', (req, res, next) => {
	let id = req.params.id;
	
	let bookId = req.query.book;
	
	console.log('***\n\n' + new Date() + ':\nAdd book' + bookId + ' for reader ' + id);
	
	booksReq.decreaseBookCount(bookId, function (err, responseCode, body) {
		if (err || responseCode != 200 || JSON.parse(body).result != 1)
			res.status(responseCode).send(JSON.parse(body));
		else {
			readersReq.addBookToReader(id, bookId, function (err, responseCode, body) {
				if (err || responseCode != 200 || JSON.parse(body).result != 1) {
					booksReq.increaseBookCount(bookId, function (err, responseCode, body) {});
				}
				
				res.status(responseCode).send(JSON.parse(body));
			});
		}
	});
});

router.delete('/readers/:id/books', (req, res, next) => {
	let id = req.params.id;
	
	let bookId = req.query.book;
	
	console.log('***\n\n' + new Date() + ':\nRemove book' + bookId + ' for reader ' + id);
	
	readersReq.removeBookFromReader(id, bookId, function (err, responseCode, body) {
		if (err || responseCode != 200 || JSON.parse(body).result != 1)
			res.status(responseCode).send(JSON.parse(body));
		else {
			booksReq.increaseBookCount(bookId, function (err, responseCode, body) {
				res.status(responseCode).send(JSON.parse(body));
			});
		}
	});
});