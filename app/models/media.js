/**
 * Created by mspalti on 8/1/14.
 */

module.exports =  function(sequelize, DataTypes) {

    var ItemContent =
        sequelize.define('ItemContent',
            {
                id: {
                    type: DataTypes.INTEGER(4),
                    primaryKey: true,
                    autoIncrement: true },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false
                }
            },  {
                getterMethods: {
                    getContentObject: function() {
                        return {'id': this.getDataValue('id'), 'name': this.getDataValue('name')};
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
                        ItemContent.belongsTo(models.ItemContentTarget)
                    }
                }
            });

    return ItemContent;
};