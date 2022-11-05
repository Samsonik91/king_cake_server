const {Order, OrderCake, User, Cake, Price} = require("../models/model")
const nodemailer = require('nodemailer')

const cartController = {

    setOrder: async(req, res)=> {

        const userId = req.userId
        console.log(userId)
        const {items, phone, name} = req.body

        const order = await Order.create({name, phone, userId})
        const orderId = order.id
        for (let i = 0; i < items.length; i++) {
            const orderCake = await OrderCake.create({
                orderId,
                quantity: items[i].quantity,
                cakeId: items[i].cakeId,
                priceId: items[i].priceId
            })
        }


        const admin = await User.findOne({where: {role: process.env.ROLE}})
        const email = admin.email

        const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: email,
                    pass: process.env.EMAIL_TOKEN
                },
                tls : { rejectUnauthorized: false }
            }
        )

        const mailOptions = {
            from: 'king_cake@gmail.com',
            to: email,
            subject: 'Новый заказ на King Cake',
            text: `Вам поступил новый заказ на King Cake`
        }

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(200).json({message: error.message})
            }
            return res.status(201).json({message: `Ваш заказ успешно создан`})
        })
    },

    getOrderCakes: async(id)=> {

        const orderCakes = await OrderCake.findAll({where: {orderId: id}})
        const cakes = []

        for(let i=0; i<orderCakes.length; i++){
            const cake = await Cake.findOne({where: {id: orderCakes[i].cakeId}})
            const price = await Price.findOne({where: {id: orderCakes[i].priceId}})
            cakes.push({
                orderCakeId: orderCakes[i].id,
                orderId: +id,
                img: cake.img,
                name: cake.name,
                quantity: orderCakes[i].quantity,
                weight: (price.weight/1000).toFixed(1),
                value: price.value,
                summary: price.value * orderCakes[i].quantity
            })
        }
        return cakes
    },

    getOrders: async(req, res)=> {
        const ord = await Order.findAndCountAll()
        const rows = [...ord.rows]
        const ordersWithCustomers = []
        for(let i=0; i<rows.length; i++){
            let row = rows[i]
            const id = row.userId
            const createdAt = (row.createdAt).toString()

            let date = createdAt.split(' ')
            let phone = row.phone
            let name = row.name
            const day = date[2]
            const month = date[1]
            const time = (date[4]).split(':')
            date = `${day} ${month} ${time[0]}:${time[1]}`

            const customer = await User.findOne({where: {id}})
            const email = customer.email

            const cakes = await cartController.getOrderCakes(row.id)

            const newRow = {id: row.id, date, email, phone, name, cakes}
            ordersWithCustomers.push(newRow)
        }
        res.json({orders: ordersWithCustomers, count: ord.count})
    },

    deleteOrder: async(req, res)=> {
        const {id} = req.params

        await Order.destroy({where: {id}})

        return res.status(200).json({message: 'Заказ успешно удален'})
    }

}

module.exports = cartController