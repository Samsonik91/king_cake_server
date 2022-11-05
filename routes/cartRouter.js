const Router = require('express')
const cartController = require('../controllers/cartController')
const checkRole = require("../middleware/checkRole")
const getUserId = require("../middleware/getUserId")

const router = new Router()

router.get('/', checkRole(process.env.ROLE), cartController.getOrders)
router.post('/', getUserId(), cartController.setOrder)
router.delete('/:id', checkRole(process.env.ROLE), cartController.deleteOrder)

module.exports = router