const {File} = require('../models')
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
      const files = await File.findAll({
        where: {
          productId: pid
        }
      })

      res.send({
        files: files.map(file => file.toJSON())
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve the files'
      })
    }
  },

  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        let user = req.user
        let {pid} = req.body

        console.log('here')
        console.log(req.file)

        let product = await Product.findOne({
          where: {
            id: pid
          },
          include: Category
        })

        let key = ''
        if (product.Category) {
          key = `${user.email}/${product.Category.name}/${product.name}/files/${req.file.originalname}`
        } else {
          key = `${user.email}/uncategorized/${product.name}/files/${req.file.originalname}`
        }
        let params = {
            Bucket: config.aws.bucket,
            Key: key,
            Body: req.file.buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.url = response.Location
        req.body.name = req.file.originalname

        let file = await product.createFile(req.body)
        await file.setProduct(product)

        res.send({
          file: file.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the file'
      })
    }
  },

  async destroy (req, res) {
    try {
      const {fid} = req.query
      await sequelize.transaction(async (t) => {
        await File.destroy({
          where: {
            id: fid
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
        error: "An error has occured in trying to delete file"
      })
    }
  }
}