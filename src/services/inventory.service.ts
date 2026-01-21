import { Types } from 'mongoose'
import Seneca from 'seneca'
import InventoryLog from '../models/inventory.model'
import Product from '../models/product.model'
import { AppError } from '../types'

export default function inventoryService(this: Seneca.Instance) {
    const seneca = this

    seneca.add('role:inventory,cmd:adjust', createInventoryLog)
    seneca.add('role:inventory,cmd:history', listInventoryLog)

    async function createInventoryLog(msg: any, reply: any) {
        try {
            const { productId, reason, note } = msg
            const change = +msg.change

            if (!Types.ObjectId.isValid(productId)) {
                throw new AppError({
                    code: 'invalid_product_id',
                    message: 'Invalid Product ID',
                    status: 400,
                })
            }

            validateChange(reason, change)

            const product = await Product.findById(productId)
            if (!product) {
                throw new AppError({
                    code: 'not_found',
                    message: 'Product not found',
                    status: 404,
                })
            }

            const newQty = (product.quantity as number) + change

            if (newQty < 0) {
                throw new AppError({
                    code: 'insufficient_stock',
                    message: 'Insufficient stock',
                    status: 409,
                })
            }

            product.quantity = newQty
            await product.save()

            const log = await InventoryLog.create({
                productId,
                change,
                reason,
                note,
            })

            const lowStock = newQty <= (product.lowStockThreshold as number)
            reply(null, {
                productId,
                quantity: newQty,
                lowStock,
                logId: log._id,
            })
        } catch (err) {
            reply(err)
        }
    }

    async function listInventoryLog(msg: any, reply: any) {
        try {
            const { page, limit } = msg
            const options = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                sort: { createdAt: -1 },
            }

            const logs = await InventoryLog.paginate({}, options)
            reply(null, logs)
        } catch (err) {
            reply(err)
        }
    }
}

function validateChange(reason: string, change: number) {
    if (reason === 'sale' && change >= 0) {
        throw new AppError({
            code: 'invalid_change',
            message: 'Sale must have a negative change',
            status: 409,
        })
    }

    if (reason === 'purchase' && change <= 0) {
        throw new AppError({
            code: 'invalid_change',
            message: 'Purchase must have a positive change',
            status: 409,
        })
    }

    if (reason === 'adjustment' && change === 0) {
        throw new AppError({
            code: 'invalid_change',
            message: 'Adjustment change cannot be zero',
            status: 409,
        })
    }
}
