/**
 * Created by mspalti on 5/23/14.
 */

module.exports = function(sequelize, DataTypes) {

    var Collection = sequelize.define('Collection', {
        id: {type: DataTypes.INTEGER(4), primaryKey: true, autoIncrement: true},
        title: {type: DataTypes.STRING(60), allowNull: false},
        image: {type: DataTypes.STRING(80), allowNull: false, defaultValue: "no_image.gif"},
        url: {type: DataTypes.STRING(255), allowNull: false},
        description: {type: DataTypes.BLOB, allowNull: false}
    },  {
        getterMethods: {
            getCollectionObject: function() {
                return {'id': this.getDataValue('id'), 'title': this.getDataValue('title'),'url': this.getDataValue('url'), 'image': this.getDataValue('image'),'desc': this.getDataValue('description')};
            }
        },
        setterMethods: {
            name: function(val) {
                this.setDataValue('title', val);
            }
        }
    },
        {
        classMethods: {
            associate: function(models) {
                Collection.hasMany(models.TagTarget)
            }
        }
    });

    return Collection;
};