/**
 * This is borrowed from the Sequelize article:
 * Usage with Express.JS. Reads models from the
 * models directory. Added config.
 * Look into how to pass config.db param into model.
 * Created by mspalti on 5/23/14.
 */


var fs = require('fs')
    , path      = require('path')
    , Sequelize = require('sequelize')
    , lodash    = require('lodash')
    , config    = require('../../config/environment')
    , sequelize = new Sequelize(config.db, 'mspalti', 'coffee')
    , db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
