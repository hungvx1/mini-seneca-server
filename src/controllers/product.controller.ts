import { Request, Response } from 'express'
import Seneca from 'seneca'

const createProduct = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'create',
            ...req.body,
        },
        (err, product) => {
            if (err) {
                switch ((err as any).details?.orig$?.code) {
                    case 'invalid_input':
                        return res
                            .status(400)
                            .json({ message: err.details.message })
                    case 'conflict':
                        return res
                            .status(409)
                            .json({ message: err.details.message })
                    default:
                        return res
                            .status(500)
                            .json({ message: 'Internal error' })
                }
            }

            return res.status(201).json(product)
        }
    )
}

const countProduts = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'count',
            category: req.query.category,
        },
        (err, count) => {
            if (err) {
                return res.status(500).json({ message: 'Internal error' })
            }

            return res.json(count)
        }
    )
}

const listProducts = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'list',
            ...req.query,
        },
        (err, products) => {
            if (err) {
                return res.status(500).json({ message: 'Internal error' })
            }

            return res.json(products)
        }
    )
}

const getProduct = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'get',
            id: req.params.id,
        },
        (err, product) => {
            if (err) {
                switch ((err as any).details?.orig$?.code) {
                    case 'not_found':
                        return res
                            .status(404)
                            .json({ message: err.details.message })
                    default:
                        return res
                            .status(500)
                            .json({ message: 'Internal error' })
                }
            }

            return res.json(product)
        }
    )
}

const updateProduct = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'update',
            id: req.params.id,
            ...req.body,
        },
        (err, product) => {
            if (err) {
                switch ((err as any).details?.orig$?.code) {
                    case 'not_found':
                        return res
                            .status(404)
                            .json({ message: err.details.message })
                    default:
                        return res
                            .status(500)
                            .json({ message: 'Internal error' })
                }
            }

            return res.json(product)
        }
    )
}

const deleteProduct = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'product',
            cmd: 'delete',
            id: req.params.id,
        },
        (err) => {
            if (err) {
                switch ((err as any).details?.orig$?.code) {
                    case 'not_found':
                        return res
                            .status(404)
                            .json({ message: err.details.message })
                    default:
                        return res
                            .status(500)
                            .json({ message: 'Internal error' })
                }
            }

            return res.json({ message: 'Product successfully removed' })
        }
    )
}

export {
    createProduct,
    countProduts,
    listProducts,
    getProduct,
    updateProduct,
    deleteProduct,
}
