const AuthenticationController = require('./controllers/AuthenticationController')
const CategoryController = require('./controllers/CategoryController')
const ProductController = require('./controllers/ProductController')
const FileController = require('./controllers/FileController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const isAuthenticated = require('./policies/isAuthenticated')

const multer = require('multer');
const upload = multer({
  limits: { fieldSize: 1024 * 1024 * 1024 }
});

module.exports = (app) => {
  // log in
  app.post('/register', 
    AuthenticationControllerPolicy.register,  
    AuthenticationController.register),

  app.post('/login', AuthenticationController.login),

  app.post('/admin-login', 
    AuthenticationController.adminLogin),

  // category management  
  app.post('/category/new',
    isAuthenticated,
    CategoryController.create),

  app.put('/category/edit',
    isAuthenticated, 
    CategoryController.edit),

  app.get('/category/show', 
    CategoryController.show),

  app.get('/category/list', 
    CategoryController.list),

  app.delete('/category/del', 
    isAuthenticated,
    CategoryController.destroy),

  // lesson management  
  app.get('/product/show',
    ProductController.show),

  app.post('/product/new', 
    isAuthenticated, 
    ProductController.create),

  app.put('/product/edit', 
    isAuthenticated,
    ProductController.edit),

  app.get('/product/list', 
    ProductController.list),

  app.get('/product/listall', 
    ProductController.listAll),

  app.delete('/product/del', 
    isAuthenticated,
    ProductController.destroy),

  // file
  app.get('/file/list',
    FileController.list),
    
  app.post('/file/new',
    upload.single('file'),
    isAuthenticated,
    FileController.create),

  app.put('/file/edit', 
    isAuthenticated,
    FileController.edit),

  app.delete('/file/del',
    FileController.destroy)
}
  