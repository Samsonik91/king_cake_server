const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/model.js')
const ApiError = require("../error/error.js")
const {validationResult} = require("express-validator")

class userController {

    async registration(req, res, next){
        const {email, password, confirmPassword, firstName, lastName, role, phone} = req.body

        const errorsResult = validationResult(req)
        if(!errorsResult.isEmpty()) {
            return res.status(400).json({errors: errorsResult.array()})
        }

        if(!email || !password || !firstName || !lastName){
            return next(ApiError.conflict('Заполните все поля'))
        }

        const exist = await User.findOne({where: {email}})
        if(exist){
            return next(ApiError.badRequest(`Пользователь с email ${email} уже существует`))
        }

        if(password !== confirmPassword){
            return next(ApiError.badRequest('Пароль в поле "Введите пароль" и пароль в поле "Подтвердите пароль должны совпадать"'))
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const user = await User.create({email, role, password: hashPassword, firstName, lastName, phone})

        return res.status(201).json({message: 'Новый пользователь успешно создан'})
    }

    async login(req, res, next) {
        const {email, password} = req.body

        if(!email || !password){
            return next(ApiError.conflict('Пароль и email не могут быть пустыми'))
        }

        const user = await User.findOne({where: {email}})
        if(!user){
            return next(ApiError.badRequest(`Пользователь с email ${email} не зарегистрирован на сайте`))
        }

        const comparePassword = bcrypt.compare(password, user.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Некоректные email и(или) пароль'))
        }

        const token = await jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.firstName + ' ' + user.lastName,
                phone: user.phone
            },
            process.env.SECRET_KEY,
            {expiresIn: '3h'}
        )
        return res.status(200).json({token, phone: user.phone})
    }
}

module.exports = new userController()