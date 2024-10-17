const express = require('express')
const productController = require('../controllers/productController')

const router = express.Router()

//GET: /products/search?name=iphone
router.get('/search', productController.searchProductByName)

//GET: /products/paginage?page=1&limit=5
router.get('/paginage', productController.getProductsByPage)

//GET: /products
router.get('/', productController.getAllProducts)

//GET: /products/1
router.get('/:id', productController.getProductById)

//POST: /products
router.post('/', productController.createProduct)

//PUT: /products/1
router.put('/:id', productController.updateProduct)

//DELETE: /products/1
router.delete('/:id', productController.deleteProduct)

module.exports = router