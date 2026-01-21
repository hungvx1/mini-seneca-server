import { Router } from 'express'
import Seneca from 'seneca'
import {
    countProduts,
    createProduct,
    deleteProduct,
    getProduct,
    listProducts,
    updateProduct,
} from '../controllers/product.controller'
import inventoryRoutes from './inventory.route'

export default function productRoutes(seneca: Seneca.Instance) {
    const router = Router()

    router
        .route('/')
        .post((req, res) => createProduct(req, res, seneca))
        .get((req, res) => listProducts(req, res, seneca))

    router.get('/count', (req, res) => countProduts(req, res, seneca))

    router
        .route('/:id')
        .get((req, res) => getProduct(req, res, seneca))
        .patch((req, res) => updateProduct(req, res, seneca))
        .delete((req, res) => deleteProduct(req, res, seneca))

    router.use('/:id/inventory-logs', inventoryRoutes(seneca))

    return router
}
