module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  })

  Image.associate = function (models) {
    Image.belongsTo(models.Product)
  }

  return Image
}