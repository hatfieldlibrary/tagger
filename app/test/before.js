/**
 * Created by mspalti on 6/19/14.
 */

// sync the test database. The Sequelize sync force option is set
// to true.  This drops all tables with each test run.
// Must remove and reestablish foreign key constraints.
before(function(done) {
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function(){
            return db.sequelize.sync({force: true});
        })
        .then(function(){
            return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        })
        .then(function(){
            console.log('Database synchronised.');
            done();
        }, function(err){
            console.log(err);
        });

});