require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")

const router = require('./routes/index.js')
const sequelize = require('./db.js')
const errorHandler = require('./middleware/errorHandler.js')

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static('images'))
app.use('/api', router)
app.use(errorHandler)

const start = (async() => {
    try {
        await app.listen(PORT, ()=>{console.log(`The app works at ${PORT}`)})
        await sequelize.authenticate()
        await sequelize.sync()
    }catch (e) {
        console.log(e)
    }

})

start()