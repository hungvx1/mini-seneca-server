import { Request, Response, Router } from 'express'
import Seneca from 'seneca'

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
                // FIXME: Handle possible errors
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
                // FIXME: Handle possible errors
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

            return res.json(result)
        }
    )
}

export default function inventoryRoutes(seneca: Seneca.Instance) {
    const router = Router({ mergeParams: true })

    router
        .route('/')
        .post((req, res) => createInventoryLog(req, res, seneca))
        .get((req, res) => getInventoryLog(req, res, seneca))
    return router
}
