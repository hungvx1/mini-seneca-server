import { Document, Schema, model } from 'mongoose'

interface IProduct extends Document {
  name: string
  sku: string
  category: string
  price: number
  quantity: number
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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)
const Product = model('Product', productSchema)

export default Product
