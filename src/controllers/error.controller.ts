import { Response } from 'express'
import { AppError } from '../types'

export function sendHttpError(res: Response, err: unknown) {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            code: err.code,
            message: err.message,
        })
    }

    console.error(err)
    return res.status(500).json({ message: 'Internal error' })
}
