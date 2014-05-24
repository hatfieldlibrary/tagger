/*
 * GET home page.
 */

exports.create = function(req, res){
  res.render('index', { title: 'Create collection' });
};

exports.update = function(req, res){
  res.render('index', { title: 'Update collection' });
};

exports.remove = function(req, res){
  res.render('index', { title: 'Remove collection' });
};
