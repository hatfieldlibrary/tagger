'use strict';

var express = require('express');
var router = express.Router(),
  async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = async;
