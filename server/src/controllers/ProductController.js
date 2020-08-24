const {Product} = require('../models')
const {Category} = require('../models')
const {File} = require('../models')
const {sequelize} = require('../models')
const {Sequelize} = require('sequelize')
const {Op} = require('sequelize')

module.exports = {
  async show (req, res) {
    try {
      const {pid} = req.query

      const product = await Product.findOne({
        where: {
          id: pid
        },
        include: [File, Category]
      })
            
      if (!product) {
        return res.status(403).send({
          error: "Product information is incorrect"
        })
      }

      res.send({
        product: product.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve product information'
      })
    }
  },

  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {cid} = req.body
        console.log(req.body)

        let product = null
        if (cid != null) {
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

          product = await category.createProduct(req.body, {
            transaction: t
          })
          await product.setCategory(category)
        } else {
          product = await Product.create(req.body, {
            transaction: t
          })
        }
    
        res.send({
          product: product.toJSON()
        })
      })
    } catch (err) {
      console.log('from product', err)
      res.status(500).send({
        error: 'an error has occured trying to create the product'
      })
    }
  },

  async edit (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {id} = req.body
        const product = await Product.findOne({
          where: {
            id: id
          }
        })

        if (!product) {
          res.status(403).send({
            error: "Product not found"
          })
        }

        await Product.update(req.body, {
          where: {
            id: id
          },
          transaction: t
        })
        
        await product.reload()
        res.send({
          product: product.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to edit product"
      })
    }
  },

  async list (req, res) {
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

      var products = await category.getProducts()

      if (!products) {
        return res.status(403).send({
          error: "No product found"
        })
      }
      
      const productsJson = []
      products.forEach(product => {
        productsJson.push(product.toJSON())
      })
      res.send({
        products: productsJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve products"
      })
    }
  },

  async listAll (req, res) {
    try {
      console.log('here')
      const products = await Product.findAll({
        where: {
          [Op.or]: [
            'name'
          ].map(key => {
            return {
              [key] : {
                [Op.like]: `%${req.query.search}%`
              }
            }
          })
        },
        limit: 12
      })
  
      let productsJson = []
      products.forEach(product => {
        productsJson.push(product.toJSON())
      })
  
      res.send({
        products: productsJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve products"
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {pid} = req.query

        await Product.destroy({
          where: {
            id: pid
          },
          transaction: t
        })
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete product"
      })
    }
  }
}