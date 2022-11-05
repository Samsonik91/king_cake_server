const {check} = require("express-validator")

const validator = [check('email', 'Введенные вами символы не являются email').isEmail(),
    check('password', 'Пароль должен иметь в себе не менее 6 и не более 15 символов, из которых хотя бы один должен быть заглавной буквой. Ещё в пароле должна быть как минимум одна цифра').matches(/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d@$!%*#?&]{6,15}$/),
    check('firstName', "Поле 'имя' не должно быть пустым и не должно начинаться или заканчиваться пробелом.Также не должно быть длиннее 20 символов").trim().notEmpty().isLength({max: 20}),
    check('lastName', "Поле 'фамилия' не должно быть пустым и не должно начинаться или заканчиваться пробелом.Также не должно быть длиннее 20 символов").trim().notEmpty().isLength({max: 20})]

module.exports = validator