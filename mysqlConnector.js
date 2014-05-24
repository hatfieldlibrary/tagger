/**
 * Created by mspalti on 5/23/14.
 */



var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'mspalti',
    password : 'coffee'
});

module.exports = pool;



