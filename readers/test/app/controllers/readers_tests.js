'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();


chai.use(chaiHttp);
	
const expect = require('chai').expect;

describe('readers', () => {
	let reader1 = {
				id: 1,
				fio: "Корнеев Сергей Петрович"
			};
	it ('request /readers/1', function(done){
		chai.request(server)
		.get('/readers/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(reader1);
		done();
		});
	});
	
	let resultPassed = {result: 1};
	let resultNotPassed = {result: 0};
	
	it ('request PATCH /readers/1/books?book=3', function(done){
		chai.request(server)
		.patch('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
	
	it ('request PATCH /readers/1/books?book=3 again', function(done){
		chai.request(server)
		.patch('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
	it ('request DELETE /readers/1/books?book=3', function(done){
		chai.request(server)
		.delete('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.result.should.be.eql(1);
		done();
		});
	});
	
	it ('request DELETE /readers/1/books?book=3 again', function(done){
		chai.request(server)
		.delete('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
});