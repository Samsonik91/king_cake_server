const Router = require('express')
const userRouter = require("./userRouter.js")
const cakeRouter = require("./cakeRouter.js")
const typeRouter = require("./typeRouter.js")
const cartRouter = require('./cartRouter.js')

const router = new Router()

router.use('/user', userRouter)
router.use('/cake', cakeRouter)
router.use('/type', typeRouter)
router.use('/cart', cartRouter)

module.exports = router