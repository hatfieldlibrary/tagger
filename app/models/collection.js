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
                autoIncrement: true},
            title: {
                type: DataTypes.STRING(60),
                allowNull: false},
            image: {
                type: DataTypes.STRING(80),
                allowNull: false,
                defaultValue: 'no_image.gif'},
            url: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            browseType: {
                type: DataTypes.STRING(4),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(4096),
                allowNull: false
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
            }
        },  {
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
                        'ctype':this.getDataValue('ctype')};
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
                }
            }
        });

    return Collection;
};
