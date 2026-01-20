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

const countProducts = async ({ category }: { category: string }) => {
  const pipeline = []

  // Only count active products
  pipeline.push({
    $match: { isActive: true },
  })

  // // Conditionally filter by category
  if (category) {
    pipeline.push({
      $match: { category },
    })
  }

  pipeline.push({
    $count: 'count',
  })

  const result = await Product.aggregate(pipeline)
  const res = {
    count: result.length ? result[0].count : 0,
  }

  return res
}

const getProducts = async ({
  category,
  page,
  limit,
}: {
  category?: string
  page?: string
  limit?: string
}) => {
  const query: Record<string, string> = {}
  if (category) {
    query.category = category
  }

  const options = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 2,
  }

  const products = await Product.paginate(query, options)
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

  await Product.findByIdAndUpdate(id, { isActive: false })
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

  seneca.add({ role: 'product', cmd: 'count' }, async (msg, reply) => {
    try {
      const count = await countProducts(msg)
      reply(null, count)
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
