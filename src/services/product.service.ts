import asyncHandler from 'express-async-handler'

// @desc    Get products
// @route   GET /api/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get products' })
})

// @desc    Get a product
// @route   GET /api/product/:id
// @access  Private
export const getProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get a product' })
})

// @desc    Add a product
// @route   POST /api/products
// @access  Private
export const addProduct = asyncHandler(async (req, res) => {
  if (!req.body?.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }
  res.status(200).json({ message: 'Add a product' })
})

// @desc    Update a product
// @route   PUT /api/product/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Update a product' })
})

// @desc    Delete a product
// @route   DELETE /api/product/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Delete a product' })
})
