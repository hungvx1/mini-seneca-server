import Seneca from 'seneca'
import inventoryService from './services/inventory.service'
import productService from './services/product.service'

const seneca = Seneca()

seneca.use(productService)
seneca.use(inventoryService)

export default seneca
