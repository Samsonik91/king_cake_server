const {Type} = require("../models/model.js")
const ApiError = require("../error/error.js")

class typeController {
    async getAllTypes(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async createType(req, res, next){
        const {typeName} = req.body

        if(!typeName){
            return next(ApiError.conflict('Заполните все поля'))
        }

        const candidate = await Type.findOne({where: {name: typeName}})
        if(candidate){
            return next(ApiError.conflict('Такой тип уже существует'))
        }

        const type = await Type.create({name: typeName})

        const types = await Type.findAll()
        return res.status(201).json({types, message: 'Новый тип создан'})
    }

}

module.exports = new typeController()