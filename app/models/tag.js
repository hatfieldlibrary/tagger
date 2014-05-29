/**
 * Created by mspalti on 5/23/14.
 */

module.exports =  function(sequelize, DataTypes) {

    var Tag =
        sequelize.define('Tag',
        {
            id: {type: DataTypes.INTEGER(4), primaryKey: true, autoIncrement: true },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false
            }
        },  {
            getterMethods: {},

            setterMethods: {
                name: function(val) {
                    this.setDataValue('name', val);
                }
            }
        },  {
            classMethods: {
                associate: function(models) {
                    Tag.hasMany(models.TagTarget, { onDelete: 'cascade' })
                }
            }
        });

    return Tag
}
