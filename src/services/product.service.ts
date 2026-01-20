import Seneca from 'seneca'
import Product from '../models/product.model'

const createProduct = async ({
  name,
  sku,
  category,
  price,
}: {
  name: string
  sku: string
  category: string
  price: number
}) => {
  if (!name || !sku || !category || price == null) {
    const err = new Error('Missing required fields')
    ;(err as any).code = 'invalid_input'
    throw err
  }

  const exists = await Product.findOne({ sku })
  if (exists) {
    const err = new Error('SKU already exists')
    ;(err as any).code = 'conflict'
    throw err
  }

  return Product.create({
    name,
    sku,
    category,
    price,
  })
}

const getProducts = async ({
  page = 1,
  limit = 2,
}: {
  page: number
  limit: number
}) => {
  const products = await Product.paginate({}, { page, limit })
  return products
}

const getProductById = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) {
    const err = new Error('Product not found')
    ;(err as any).code = 'not_found'
    throw err
  }

  return product
}

const updateProduct = async ({
  id,
  name,
  sku,
  category,
  price,
}: {
  id: string
  name: string
  sku: string
  category: string
  price: number
}) => {
  const product = await Product.findById(id)
  if (!product) {
    const err = new Error('Product not found')
    ;(err as any).code = 'not_found'
    throw err
  }

  product.name = name || product.name
  product.sku = sku || product.sku
  product.category = category || product.category
  product.price = price || product.price

  const updatedProduct = await product.save()
  return updatedProduct
}

const deleteProduct = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) {
    const err = new Error('Product not found')
    ;(err as any).code = 'not_found'
    throw err
  }

  await Product.deleteOne({ _id: id })
}

const productService = function (this: Seneca.Instance) {
  const seneca = this

  seneca.add({ role: 'product', cmd: 'create' }, async (msg, reply) => {
    try {
      const product = await createProduct(msg)
      reply(null, product)
    } catch (err) {
      reply(err)
    }
  })

  seneca.add({ role: 'product', cmd: 'list' }, async (msg, reply) => {
    try {
      const products = await getProducts(msg)
      reply(null, products)
    } catch (err) {
      reply(err)
    }
  })

  seneca.add({ role: 'product', cmd: 'get' }, async (msg, reply) => {
    try {
      const product = await getProductById(msg.id)
      reply(null, product)
    } catch (err) {
      reply(err)
    }
  })

  seneca.add({ role: 'product', cmd: 'update' }, async (msg, reply) => {
    try {
      const product = await updateProduct(msg)
      reply(null, product)
    } catch (err) {
      reply(err)
    }
  })

  seneca.add({ role: 'product', cmd: 'delete' }, async (msg, reply) => {
    try {
      await deleteProduct(msg.id)
      reply(null)
    } catch (err) {
      reply(err)
    }
  })
}

export default productService
