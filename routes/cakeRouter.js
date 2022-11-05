const Router = require('express')
const cakeController = require("../controllers/cakeController.js")
const checkRole = require("../middleware/checkRole.js")
const upload = require("../middleware/file.js")

const router = new Router()

router.get('/', cakeController.getAll)
router.get('/:id', cakeController.getOne)
router.post('/create', checkRole(process.env.ROLE), upload, cakeController.create)
router.delete('/:id', checkRole(process.env.ROLE), cakeController.delete)

module.exports = router