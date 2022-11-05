const {Cake, Price} = require("../models/model.js")
const ApiError = require("../error/error.js")
const sorting = require("../middleware/sortingCakes")
const path = require("path")
const fs = require("fs")

class cakeController{
    async getAll(req, res){
        const {type, sortBy, page} = req.query

        const limit = 4
        let offset = page * limit - limit

        if(!sortBy && !type){
            const cakes = await Cake.findAll({include: [{model: Price, as: 'price'}], limit, offset})

            const count = await Cake.count()

            return res.json({count, cakes})
        }
        else if(!type && sortBy){
            const prices = await Price.findAll({order: [['value', 'ASC']]})

            const {count, cakes} = await sorting(prices, sortBy, limit, offset)

            return res.json({count, cakes})
        }
        else if(type && !sortBy){
            const cakes = await Cake.findAll({where: {typeId: type}, include: [{model: Price, as: 'price'}], limit, offset})

            const count = await Cake.count({where: {typeId: type}})

            return res.json({count, cakes})
        }
        else if(type && sortBy){
            const prices = await Price.findAll({where: {typeId: type}, order: [['value', 'ASC']]})

            const {count, cakes} = await sorting(prices, sortBy, limit, offset)

            return res.json({count, cakes})
        }
        else{
            return res.json({message: 'Нет тортов'})
        }
    }

    async getOne(req, res){
        const {id} = req.params

        const cake = await Cake.findOne({
            where: {id},
            include: [{model: Price, as: 'price'}]
        })
        return res.json(cake)
    }

    async create(req, res, next){
        let {name, type, prices, ingredients, description} = req.body

        if(!name || !type || !prices || !ingredients || !description){
            return next(ApiError.conflict('Заполните все поля'))
        }

        const {file} = req

        const isExist = await Cake.findOne({where: {name}})
        if(isExist){
            return next(ApiError.badRequest(`торт с таким названием уже существует`))
        }

        const cake = await Cake.create({name, typeId: type, description, ingredients, img: path.join('images', file.filename)})

        const priceJSON = JSON.parse(prices)

        console.log(`priceJSON: ${priceJSON}`)
        priceJSON.forEach(p =>
            Price.create({
                weight: p.weight,
                value: p.value,
                cakeId: cake.id,
                typeId: type
            })
        )

        return res.json({message: 'Новый торт создан'})
    }

    async delete(req, res){
        const {id} = req.params

        const cake = await Cake.findOne({where: {id}})

        const img = cake.img

        await fs.unlinkSync(img)

        await Price.destroy({where: {cakeId: id}})
        await Cake.destroy({where: {id}})

        return res.status(200).json({message: 'Торт успешно удален'})
    }
}

module.exports = new cakeController()