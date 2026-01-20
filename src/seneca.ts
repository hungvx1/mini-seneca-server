import Seneca from 'seneca'
import productService from './services/product.service'

const seneca = Seneca()

seneca.use(productService)

export default seneca
