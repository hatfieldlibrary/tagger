'use strict';
/**
 * Created by mspalti on 5/23/14.
 */

module.exports = function(sequelize, DataTypes) {

  var Collection = sequelize.define('Collection',
    {
      id: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      image: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: 'no_image.gif'
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      browseType: {
        type: DataTypes.STRING(4),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(4096),
        allowNull: true
      },
      dates: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      items: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      ctype: {
        type: DataTypes.STRING(3),
        allowNull: true
      },
      repoType: {
        type: DataTypes.STRING(7),
        defaultValue: 'DEFAULT',
        allowNull: false
      },
      restricted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      getterMethods: {
        getCollectionObject: function() {
          return {
            'id': this.getDataValue('id'),
            'title': this.getDataValue('title'),
            'url': this.getDataValue('url'),
            'browseType': this.getDataValue('browseType'),
            'image': this.getDataValue('image'),
            'desc': this.getDataValue('description'),
            'dates': this.getDataValue('dates'),
            'items': this.getDataValue('items'),
            'ctype':this.getDataValue('ctype'),
            'repoType':this.getDataValue('repoType'),
            'categoryId':this.getDataValue('categoryId'),
            'restricted': this.getDataValue('restricted')
          };
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
          Collection.hasMany(models.TagTarget);
          Collection.hasMany(models.ItemContentTarget);
          Collection.hasMany(models.AreaTargets);
          Collection.hasOne((models.CategoryTarget));
        }
      }
    });

  return Collection;
};
