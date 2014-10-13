/**
 * Created by mspalti on 5/23/14.
 */

module.exports =  function(sequelize, DataTypes) {

    var Tag =
        sequelize.define('Tag',
        {
            id: {
                type: DataTypes.INTEGER(4),
                primaryKey: true,
                autoIncrement: true },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false
            },
            url: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
            ,
            type: {
                type: DataTypes.STRING(3),
                allowNull: false
            }
        },  {
            getterMethods: {
                getContentObject: function() {
                    return {'id': this.getDataValue('id'), 'name': this.getDataValue('name'), 'url': this.getDataValue('url'), 'type': this.getDataValue('type')};
                }
            },
            setterMethods: {
                name: function(val) {
                    this.setDataValue('name', val);
                }
            }
        },  {
            classMethods: {
                associate: function(models) {
                    Tag.belongsTo(models.TagTarget)
                }
            }
        });

    return Tag
};
