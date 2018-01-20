'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();

chai.use(chaiHttp);
	
const expect = require('chai').expect;

describe('books', () => {
	let book3 = {
				id: 3,
				title: "Голуби",
				authorId: 1,
				year: 1995
			};
			
	it ('request /books', function(done){
		chai.request(server)
		.get('/books')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(5);
		res.body.rows[0].should.be.eql(book3);
		res.body.count.should.be.eql(5);
		done();
		});
	});
	
	it ('request /books?author=1&page=0&size=1)', function(done){
		chai.request(server)
		.get('/books?author=1&page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(book3);
		res.body.count.should.be.eql(2);
		done();
		});
	});
	
	let book6Full = {
			id: 6,
			title: "Реванш",
			about: "Спортивная драма.",
			authorId: 4,
			year: 1999,
			count: 1,
			createdAt: "2018-01-16T21:00:00.000Z",
			updatedAt: "2018-01-16T21:00:00.000Z"
		};
	it ('request /books/6', function(done){
		chai.request(server)
		.get('/books/6')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(book6Full);
		done();
		});
	});
	
	let resultPassed = {result: 1};
	let resultNotPassed = {result: 0};
	it ('request PATCH /books/4', function(done){
		chai.request(server)
		.patch('/books/4')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
	
	it ('request PATCH /books/4 again', function(done){
		chai.request(server)
		.patch('/books/4')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
	it ('request DELETE /books/4', function(done){
		chai.request(server)
		.delete('/books/4')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
});