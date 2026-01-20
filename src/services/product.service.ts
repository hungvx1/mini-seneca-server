import asyncHandler from 'express-async-handler'
import Product from '../models/product.model'

// @desc    Get products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// @desc    Get a product
// @route   GET /api/product/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.json(product)
})

// @desc    Add a product
// @route   POST /api/products
// @access  Private
export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    price,
  }: { name: string; sku: string; category: string; price: number } = req.body

  if (!name || !sku || !category || price == null) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const exists = await Product.findOne({ sku })
  if (exists) {
    return res.status(409).json({ message: 'SKU already exists' })
  }

  const product = await Product.create({
    name,
    sku,
    category,
    price,
  })

  res.status(201).json(product)
})

// @desc    Update a product
// @route   PUT /api/product/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const {
    name,
    sku,
    category,
    price,
  }: { name: string; sku: string; category: string; price: number } = req.body

  product.name = name || product.name
  product.sku = sku || product.sku
  product.category = category || product.category
  product.price = price || product.price

  const updatedProduct = await product.save()
  res.json(updatedProduct)
})

// @desc    Delete a product
// @route   DELETE /api/product/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await Product.deleteOne({ _id: req.params.id })
  res.json({ message: 'Product successfully removed' })
})
