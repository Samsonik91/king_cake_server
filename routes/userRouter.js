const Router = require('express')
const userController = require('../controllers/userController.js')
const validator = require("../middleware/validator.js")

const router = new Router()

router.post('/registration', validator, userController.registration)
router.post('/login', userController.login)

module.exports = router