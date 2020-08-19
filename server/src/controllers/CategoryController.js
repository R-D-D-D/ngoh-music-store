const {Category} = require('../models')
const {User} = require('../models')
const {sequelize} = require('../models')
const { show } = require('./ProductController')

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const user = req.user

        req.body.duration = 0
        const category = await Category.create(req.body, {
          transaction: t
        })
  
        res.send({
          category: category.toJSON()
        })
      })
    } catch (err) {
      console.log('from category', err)
      res.status(500).send({
        error: 'an  error has occured trying to create the category'
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {cid} = req.query
        await Category.destroy({
          where: {
            id: cid
          },
          individualHooks: true,
          transaction: t
        })
  
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete category"
      })
    }
  },

  async edit (req, res) {
    try {
      const user = req.user
      let category = await Category.findOne({
        where: {
          id: req.body.id
        }
      })
      
      sequelize.transaction(async (t) => {
        await Category.update(req.body, {
          where: {
            id: req.body.id
          },
          transaction: t
        })
      })

      await category.reload()

      res.send({
        category: category.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to edit category"
      })
    }
  },

  async show (req, res) {
    try {
      const {cid} = req.query
      const category = await Category.findOne({
        where: {
          id: cid
        }
      })

      if (!category) {
        return res.status(403).send({
          error: "Category information is incorrect"
        })
      }

      res.send({
        category: category.toJSON()
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve category"
      })
    }
  },

  async list (req, res) {
    try {
      const categories = await Category.findAll()
      const categoriesJson = []
      categories.forEach(category => {
        categoriesJson.push(category.toJSON())
      })
      res.send({
        categories: categoriesJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve categories"
      })
    }
  },
}