import express from 'express'
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../services/product.service'

const router = express.Router()

router.route('/').get(getProducts).post(addProduct)
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router
