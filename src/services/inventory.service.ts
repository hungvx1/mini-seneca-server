import { Types } from 'mongoose'
import Seneca from 'seneca'
import InventoryLog from '../models/inventory.model'
import Product from '../models/product.model'

const createInventoryLog = async ({
  productId,
  change,
  reason,
  note,
}: {
  productId: string
  change: number
  reason: 'sale' | 'purchase' | 'adjustment'
  note?: string
}) => {
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
  return {
    productId,
    quantity: newQty,
    lowStock,
    logId: log._id,
  }
}

const getInventoryLog = async (productId: string) =>
  InventoryLog.find({ productId })

export default function inventoryService(this: Seneca.Instance) {
  const seneca = this

  // Adjust inventory
  seneca.add({ role: 'inventory', cmd: 'adjust' }, async (msg, reply) => {
    try {
      const log = await createInventoryLog({ ...msg, change: +msg.change })
      reply(null, log)
    } catch (err) {
      reply(err)
    }
  })

  // Inventory history
  seneca.add({ role: 'inventory', cmd: 'history' }, async (msg, reply) => {
    try {
      const product = await getInventoryLog(msg.productId)
      reply(null, product)
    } catch (err) {
      reply(err)
    }
  })
}
