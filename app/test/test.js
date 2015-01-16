/**
 * Created by mspalti on 6/17/14.
 */

var should = require('chai').should(),
    request = require('supertest');

var app = require('../app');

describe('Tagger CRUD operations', function() {


    it("should insert a new collection into the Collections table", function(done) {
        request(app)
            .post('/collection/create')
            .type('form')
            .send({name: 'Test One'})
            .send({url: 'http://localhost:3000'})
            .send({description: 'This is a test collection.'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                res.text.should.have.string('Test One');
                done()
            })
    });

    it("should retrieve the new collection", function(done) {
        request(app)
            .get("/form/collection")
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.have.string('Test One');
                done();
            })
    });

    it("should create a tag", function(done) {
        request(app)
            .post('/admin/tag/create')
            .type('form')
            .send({name:'Summer'})
            .expect(200)
            .end(function(err,res) {
                should.not.exist(err);
                res.text.should.have.string('Summer');
                done();
            })
    })

    it("should add tag to collection", function(done) {
        request(app)
            .post('/collection/tag')
            .type('form')
            .send({collid: '1'})
            .send({tagid: "1"})
            .expect(302)
            .end(function(err,res) {
                should.not.exist(err);
                done();
            })
    })

});

describe('Tagger REST API responses', function() {

    it("should return json response with one collection object name Test One", function (done) {
        request(app)
            .get('/rest/collection/bytag/1')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                should.not.exist(err);
             //   console.log(res);
                res.text.should.have.string('Test One');
                done();
            })
    })
});

