const Router = require('express')
const  typeController = require("../controllers/typeController.js")
const checkRole = require("../middleware/checkRole.js")


const router = new Router()

router.get('/', typeController.getAllTypes)
router.post('/create', checkRole(process.env.ROLE), typeController.createType)

module.exports = router