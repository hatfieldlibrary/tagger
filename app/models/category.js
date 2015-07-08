'use strict';
/**
 * Created by mspalti on 7/7/15.
 */

module.exports = function(sequelize, DataTypes) {

  var Category = sequelize.define('Category',
    {
      id: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        autoIncrement: true},
      title: {
        type: DataTypes.STRING(60),
        allowNull: false},
      url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(4096),
        allowNull: false
      }
    },  {
      getterMethods: {
        getCollectionObject: function() {
          return {
            'id': this.getDataValue('id'),
            'title': this.getDataValue('title'),
            'url': this.getDataValue('url'),
            'desc': this.getDataValue('description')
          };
        }
      },
      setterMethods: {
        name: function(val) {
          this.setDataValue('title', val);
        }
      }
    });

  return Category;
};
