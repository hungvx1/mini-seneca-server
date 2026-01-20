import bodyParser from 'body-parser'
import 'dotenv/config'
import express from 'express'
import connectDB from './config/db'
import productRoutes from './routes/product.route'
import seneca from './seneca'

connectDB()
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/products', productRoutes(seneca))

app.listen(3000, () => console.log(`Server running on port ${port}`))
