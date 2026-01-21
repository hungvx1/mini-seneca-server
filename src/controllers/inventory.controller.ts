import { Request, Response } from 'express'
import Seneca from 'seneca'
import { SenecaError } from '../types'
import { sendHttpError } from './error.controller'

const createInventoryLog = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'inventory',
            cmd: 'adjust',
            productId: req.params.id,
            ...req.body,
        },
        (err, result) => {
            if (err) {
                return sendHttpError(res, (err as SenecaError).details?.orig$)
            }

            return res.status(201).json(result)
        }
    )
}

const getInventoryLog = async (
    req: Request,
    res: Response,
    seneca: Seneca.Instance
) => {
    seneca.act(
        {
            role: 'inventory',
            cmd: 'history',
            productId: req.params.id,
        },
        (err, result) => {
            if (err) {
                return sendHttpError(res, (err as SenecaError).details?.orig$)
            }

            return res.json(result)
        }
    )
}

export { createInventoryLog, getInventoryLog }
