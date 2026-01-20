import { Document, model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

interface IProduct extends Document {
  name: string
  sku: string
  category: string
  price: number
  quantity?: number
  lowStockThreshold?: number
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

productSchema.plugin(mongoosePaginate)

const Product = model<IProduct>('Product', productSchema)

export default Product
