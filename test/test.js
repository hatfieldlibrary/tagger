/**
 * Created by mspalti on 6/17/14.
 */

var should = require('chai').should(),
    request = require('supertest')


var app = require('../app');
 /*
describe('Tagger CRUD operations', function() {
    it("should insert a new collection into the Collections table", function(done) {
        request(app)
            .post('/collection/create')
            .type('form')
            .send({name: 'Test One'})
            .send({url: 'http://localhost:3000'})
            .send({description: 'This is a test collection.'})
            .expect(200, done)
            .end(function(err, res) {
                should.not.exist(err);
              //  res.text.should.have.string('Test One')
            })

    })
});
 */
describe('Tagger REST API responses', function() {

    it("should return json response with one collection object name Test One", function (done) {
        request(app)
            .get('/rest/collection/bytag/1')
            .expect(200, done)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                should.not.exist(err);
                console.log(res);
            //    res.text.should.have.string('Test One');
                done();
            })
    })
});

