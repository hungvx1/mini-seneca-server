import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { errorHandler } from './middlewares/error.middleware'
import connectDB from './config/db'

connectDB()
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/products', require('./routes/product.route'))
app.use(errorHandler)

app.listen(3000, () => console.log(`Server running on port ${port}`))
