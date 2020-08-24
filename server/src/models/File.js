module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    position: DataTypes.INTEGER
  })

  File.associate = function (models) {
    File.belongsTo(models.Product)
  }

  return File
}