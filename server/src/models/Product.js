module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.DOUBLE
  })

  Product.associate = function (models) {
    Product.belongsTo(models.Category)
    Product.hasMany(models.File)
  }
  
  return Product
}