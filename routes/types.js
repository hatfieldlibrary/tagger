/**
 * Created by mspalti on 5/23/14.
 */

var pool = require('../mysqlConnector');

exports.create = function(req, res){

    var tagName = req.query.name;
    pool.getConnection(function(err, connection) {
        connection.query('USE acomtags');
        var queryString =  "INSERT into tag_type (name) values ('" + tagName + "')";
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
        var queryString =  "Update tag_type set tag_type_name = '" + tagName + "' where tag_type_id = " + tagId;
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
        var queryString = "Delete from tag_type where tag_type_id = '" + tagId + "'";
        connection.query(queryString, function (err, rows) {
            res.send('result', {id: tagId, rows: rows });
            connection.release();
        });
    });

};