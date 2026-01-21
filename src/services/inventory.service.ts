import { Types } from 'mongoose'
import Seneca from 'seneca'
import InventoryLog from '../models/inventory.model'
import Product from '../models/product.model'

export default function inventoryService(this: Seneca.Instance) {
  const seneca = this

  seneca.add('role:inventory,cmd:adjust', createInventoryLog)
  seneca.add('role:inventory,cmd:history', getInventoryLog)

  async function createInventoryLog(msg: any, reply: any) {
    try {
      const { productId, reason, note } = msg
      const change = +msg.change

      if (!Types.ObjectId.isValid(productId)) {
        const err = new Error('Invalid Product ID')
        ;(err as any).code = 'invalid_product_id'
        throw err
      }

      if (!change || change === 0) {
        const err = new Error('Change must be non-zero')
        ;(err as any).code = 'invalid_change'
        throw err
      }

      const product = await Product.findById(productId)
      if (!product) {
        const err = new Error('Product not found')
        ;(err as any).code = 'not_found'
        throw err
      }

      const newQty = (product.quantity as number) + change

      if (newQty < 0) {
        const err = new Error('Insufficient stock')
        ;(err as any).code = 'insufficient_stock'
        throw err
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

  async function getInventoryLog(msg: any, reply: any) {
    try {
      const { productId } = msg
      const product = await InventoryLog.find({ productId })
      reply(null, product)
    } catch (err) {
      reply(err)
    }
  }
}
