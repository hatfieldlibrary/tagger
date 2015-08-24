/**
 * Created by mspalti on 6/19/14.
 */

// Sync the test database. The Sequelize sync force option is set
// to true.  This will drop all tables before each test run.
// To drop tables, we must remove and then reestablish foreign key
// constraints.
before(function(done) {
    db.sequelize.query('SET foreign_key_checks = 0')
        .then(function(){
            return db.sequelize.sync({force: true});
        })
        .then(function(){
            return db.sequelize.query('SET foreign_key_checks = 1')
        })
        .then(function(){
            console.log('Database synchronised.');
            done();
        }, function(err){
            console.log(err);
        });

});
