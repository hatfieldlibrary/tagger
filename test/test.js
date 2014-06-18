/**
 * Created by mspalti on 6/17/14.
 */

var chai = require('chai'),
    request = require('supertest'),
    should = chai.should();

var app = require('../app');

describe('Tagger REST API responses', function() {
    it("should return json response with one collection object name Test One", function (done) {
        request(app)
            .get('/rest/collection/bytag/1')
            .expect(200, done)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                should.not.exist(err);
                console.log(res);
                res.text.should.have.string('Test One');
                done();
            })
    })
});

