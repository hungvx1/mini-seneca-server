import { Request, Response } from 'express'
import Seneca from 'seneca'
import { SenecaError } from '../types'
import { sendHttpError } from './error.controller'

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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
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
                return sendHttpError(res, (err as SenecaError).details?.orig$)
            }

            return res.json({ message: 'Product successfully removed' })
        }
    )
}

export {
    countProduts,
    createProduct,
    deleteProduct,
    getProduct,
    listProducts,
    updateProduct,
}
