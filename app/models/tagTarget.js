/**
 * Created by mspalti on 5/29/14.
 */

module.exports = function(sequelize, DataTypes) {

    var TagTarget = sequelize.define('TagTarget', {
        id: {type: DataTypes.INTEGER(4), primaryKey: true, autoIncrement: true},
       // coll_id: {type: DataTypes.INTEGER(4), allowNull: false},
       // tag_id: {type: DataTypes.INTEGER(4), allowNull: false}


    }, {
        classMethods: {
            associate: function(models) {
                     TagTarget.belongsTo(models.Tag)
            }
        }
    });

    return TagTarget;
};