'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();


chai.use(chaiHttp);
	
const expect = require('chai').expect;

describe('authors', () => {
	let author3 = {"id":3,"fio":"Вронский Александр Петрович"};
	it ('request of all authors /authors?page=0&size=1', function(done){
		chai.request(server)
		.get('/authors?page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(author3);
		res.body.count.should.be.eql(4);
		done();
		});
	});
	
	it ('request of all authors /authors', function(done){
		chai.request(server)
		.get('/authors')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(4);
		res.body.rows[0].should.be.eql(author3);
		res.body.count.should.be.eql(4);
		done();
		});
	});
	
	it ('request of /author/3', function(done){
		chai.request(server)
		.get('/authors/3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(author3);
		done();
		});
	});
});
