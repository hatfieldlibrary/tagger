/**
 * Created by mspalti on 5/23/14.
 */

module.exports = function(sequelize, DataTypes) {

    var Collection = sequelize.define('Collection', {
        id: {type: DataTypes.INTEGER(4), primaryKey: true, autoIncrement: true},
        title: {type: DataTypes.STRING(60), allowNull: false},
        url: {type: DataTypes.STRING(255), allowNull: false},
        description: {type: DataTypes.BLOB, allowNull: false}
    }, {
        classMethods: {
            associate: function(models) {
                Collection.hasMany(models.TagTarget)
            }
        }
    });

    return Collection;
};