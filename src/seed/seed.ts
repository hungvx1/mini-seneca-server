import mongoose from 'mongoose'
import Product from '../models/product.model'
import 'dotenv/config'
import products from './products.seed.json'

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('Connected to MongoDB')

        await Product.deleteMany({})
        await Product.insertMany(products)

        console.log('✅ Products seeded successfully')
        process.exit(0)
    } catch (err) {
        console.error('❌ Seeding error:', err)
        process.exit(1)
    }
}

seed()
