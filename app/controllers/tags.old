/*
 * GET home page.
 */

var pool = require('../mysqlConnector');

exports.create = function(req, res){

    var tagName = req.query.name;
    pool.getConnection(function(err, connection) {
        connection.query('USE acomtags');
        var queryString =  "INSERT into tags (name) values ('" + tagName + "')";
        connection.query(queryString, function (err, rows) {
            res.send('result', {id: tagName, rows: rows });
            connection.release();
        });
    });

};

exports.update = function(req, res) {

    var tagId= req.query.id;
    var tagName = req.query.name;
    pool.getConnection(function(err, connection) {
        connection.query('USE acomtags');
        var queryString =  "Update tags set name = '" + tagName + "' where id = " + tagId;
        connection.query(queryString, function (err, rows) {
            res.send('result', {name: tagName, rows: rows });
            connection.release();
        });
    });

};

exports.remove = function(req, res) {

    var tagId= req.query.id;
    pool.getConnection(function(err, connection) {
        connection.query('USE acomtags');
        var queryString = "Delete from tags where id = '" + tagId + "'";
        connection.query(queryString, function (err, rows) {
            res.send('result', {id: tagId, rows: rows });
            connection.release();
        });
    });

};

