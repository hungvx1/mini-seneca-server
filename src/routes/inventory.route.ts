import { Router } from 'express'
import Seneca from 'seneca'
import {
    createInventoryLog,
    getInventoryLog,
} from '../controllers/inventory.controller'

export default function inventoryRoutes(seneca: Seneca.Instance) {
    const router = Router({ mergeParams: true })

    router
        .route('/')
        .post((req, res) => createInventoryLog(req, res, seneca))
        .get((req, res) => getInventoryLog(req, res, seneca))
    return router
}
