const {Image} = require('../models')
const {Product} = require('../models')
const {Category} = require('../models')
const {sequelize} = require('../models')
const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async list (req, res) {
    try {
      const {pid} = req.query
      const images = await Image.findAll({
        where: {
          productId: pid
        }
      })

      res.send({
        images: images.map(image => image.toJSON())
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve the images'
      })
    }
  },

  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        let user = req.user
        let {pid} = req.body
        console.log(req.file)

        let product = await Product.findOne({
          where: {
            id: pid
          },
          include: Category
        })

        let key = ''
        if (product.Category) {
          key = `${user.email}/${product.Category.name}/${product.name}/images/${req.file.originalname}`
        } else {
          key = `${user.email}/uncategorized/${product.name}/images/${req.file.originalname}`
        }
        let params = {
            Bucket: config.aws.bucket,
            Key: key,
            Body: req.file.buffer
        }
    
        // Uploading images to the bucket
        const response = await s3.upload(params).promise()
        req.body.url = response.Location
        req.body.name = req.file.originalname

        let image = await product.createImage(req.body)
        await image.setProduct(product)

        res.send({
          image: image.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the image'
      })
    }
  },

  async destroy (req, res) {
    try {
      const {iid} = req.query
      await sequelize.transaction(async (t) => {
        await Image.destroy({
          where: {
            id: iid
          },
          transaction: t,
          individualHooks: true
        })
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete image"
      })
    }
  }
}