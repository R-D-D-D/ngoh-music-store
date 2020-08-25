module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  })

  Category.associate = function (models) {
    Category.hasMany(models.Product, {
      onDelete: 'CASCADE',
      hooks: true
    })
    Category.hasOne(models.File, {
      onDelete: 'CASCADE',
      hooks: true
    })
  }
  
  return Category
}