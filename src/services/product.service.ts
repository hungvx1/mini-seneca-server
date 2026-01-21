import { Types } from 'mongoose'
import Seneca from 'seneca'
import Product from '../models/product.model'
import { AppError } from '../types'

export default function productService(this: Seneca.Instance) {
    const seneca = this

    seneca.add('role:product,cmd:create', createProduct)
    seneca.add('role:product,cmd:count', countProducts)
    seneca.add('role:product,cmd:list', listProducts)
    seneca.add('role:product,cmd:get', getProduct)
    seneca.add('role:product,cmd:update', updateProduct)
    seneca.add('role:product,cmd:delete', deleteProduct)

    async function createProduct(msg: any, reply: any) {
        try {
            const { name, sku, category, price, lowStockThreshold } = msg

            if (!name || !sku || !category || price == null) {
                throw new AppError({
                    code: 'invalid_input',
                    message: 'Missing required fields',
                    status: 400,
                })
            }

            const exists = await Product.findOne({ sku })
            if (exists) {
                throw new AppError({
                    code: 'sku_conflict',
                    message: 'SKU already exists',
                    status: 409,
                })
            }

            const product = await Product.create({
                name,
                sku,
                category,
                price,
                lowStockThreshold,
            })

            reply(null, product)
        } catch (err) {
            reply(err)
        }
    }

    async function countProducts(
        { category }: { category: string },
        reply: any
    ) {
        try {
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

            /** Alternative
            pipeline.push([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                    },
                },
            ])
             */

            const result = await Product.aggregate(pipeline)
            const count = {
                count: result.length ? result[0].count : 0,
            }

            reply(null, count)
        } catch (err) {
            reply(err)
        }
    }

    async function listProducts(
        {
            category,
            page,
            limit,
        }: {
            category?: string
            page?: string
            limit?: string
        },
        reply: any
    ) {
        try {
            const query: Record<string, string> = {}
            if (category) {
                query.category = category
            }

            const options = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
            }

            const products = await Product.paginate(query, options)
            reply(null, products)
        } catch (err) {
            reply(err)
        }
    }

    async function getProduct({ id }: { id: string }, reply: any) {
        try {
            const pipeline = []

            // Get the most 10 recent logs along with the product
            pipeline.push(
                {
                    $match: {
                        _id: Types.ObjectId(id),
                        isActive: true,
                    },
                },
                {
                    $lookup: {
                        from: 'inventories',
                        let: { productId: '$_id' },
                        pipeline: [
                            {
                                // https://www.mongodb.com/docs/manual/tutorial/aggregation-examples/multi-field-join/
                                $match: {
                                    $expr: {
                                        $eq: ['$productId', '$$productId'],
                                    },
                                },
                            },
                            { $sort: { createdAt: -1 } },
                            { $limit: 10 },
                        ],
                        as: 'recentInventoryLogs',
                    },
                }
            )

            const result = await Product.aggregate(pipeline)
            if (result.length === 0) {
                throw new AppError({
                    code: 'not_found',
                    message: 'Product not found',
                    status: 404,
                })
            }

            reply(null, result[0])
        } catch (err) {
            reply(err)
        }
    }

    async function updateProduct(
        {
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
        },
        reply: any
    ) {
        try {
            const product = await Product.findOne({
                _id: id,
                isActive: true,
            })
            if (!product) {
                throw new AppError({
                    code: 'not_found',
                    message: 'Product not found',
                    status: 404,
                })
            }

            product.name = name || product.name
            product.sku = sku || product.sku
            product.category = category || product.category
            product.price = price || product.price

            const updatedProduct = await product.save()
            reply(null, updatedProduct)
        } catch (err) {
            reply(err)
        }
    }

    async function deleteProduct({ id }: { id: string }, reply: any) {
        try {
            const product = await Product.findOne({
                _id: id,
                isActive: true,
            })
            if (!product) {
                throw new AppError({
                    code: 'not_found',
                    message: 'Product not found',
                    status: 404,
                })
            }

            await Product.findByIdAndUpdate(id, { isActive: false })
            reply(null)
        } catch (err) {
            reply(err)
        }
    }
}
