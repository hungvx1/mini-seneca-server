import { Types, Document, model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

interface IInventoryLog extends Document {
  productId: Types.ObjectId
  change: number
  reason: 'sale' | 'purchase' | 'adjustment'
  note?: string
  createdAt: Date
}

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
      index: true,
    },
    change: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['sale', 'purchase', 'adjustment'],
      required: true,
    },
    note: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
)

inventoryLogSchema.plugin(mongoosePaginate)

const InventoryLog = model<IInventoryLog>('Inventory', inventoryLogSchema)

export default InventoryLog
