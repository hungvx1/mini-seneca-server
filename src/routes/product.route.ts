import { Request, Response, Router } from 'express'
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
            return res.status(400).json({ message: err.details.message })
          case 'conflict':
            return res.status(409).json({ message: err.details.message })
          default:
            return res.status(500).json({ message: 'Internal error' })
        }
      }

      return res.status(201).json(product)
    }
  )
}

const getProducts = async (
  req: Request,
  res: Response,
  seneca: Seneca.Instance
) => {
  seneca.act(
    {
      role: 'product',
      cmd: 'list',
      ...req.body,
    },
    (err, products) => {
      if (err) {
        return res.status(500).json({ message: 'Internal error' })
      }

      return res.json(products)
    }
  )
}

const getProductById = async (
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
            return res.status(404).json({ message: err.details.message })
          default:
            return res.status(500).json({ message: 'Internal error' })
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
            return res.status(404).json({ message: err.details.message })
          default:
            return res.status(500).json({ message: 'Internal error' })
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
            return res.status(404).json({ message: err.details.message })
          default:
            return res.status(500).json({ message: 'Internal error' })
        }
      }

      return res.json({ message: 'Product successfully removed' })
    }
  )
}

export default function productRoutes(seneca: Seneca.Instance) {
  const router = Router()

  router
    .route('/')
    .post((req, res) => createProduct(req, res, seneca))
    .get((req, res) => getProducts(req, res, seneca))

  router
    .route('/:id')
    .get((req, res) => getProductById(req, res, seneca))
    .put((req, res) => updateProduct(req, res, seneca))
    .delete((req, res) => deleteProduct(req, res, seneca))

  return router
}
