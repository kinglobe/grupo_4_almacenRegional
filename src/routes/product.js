var express = require('express');
var router = express.Router();
const productController = require('../controllers/productsController')
/* / */
router.get('/detalleProducto', productController.products);



module.exports = router;
