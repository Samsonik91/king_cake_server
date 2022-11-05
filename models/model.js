const sequelize = require("../db")
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    phone: {type: DataTypes.STRING, defaultValue: '+38 0'}
})

const Order = sequelize.define('order',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    phone: {type: DataTypes.STRING, defaultValue: ''}
})

const OrderCake = sequelize.define('order_cake',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, defaultValue: 1}
})

const Cake = sequelize.define('cake',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    ingredients: {type: DataTypes.STRING(500), allowNull: false},
    description: {type: DataTypes.STRING(1500), allowNull: false}
})

const Price = sequelize.define('price',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    weight: {type: DataTypes.INTEGER, allowNull: false},
    value: {type: DataTypes.INTEGER, allowNull: false}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(OrderCake)
OrderCake.belongsTo(Order)

Cake.hasMany(OrderCake)
OrderCake.belongsTo(Cake)

Cake.hasMany(Price, {as: 'price'})
Price.belongsTo(Cake)

Price.hasMany(OrderCake)
OrderCake.belongsTo(Price)

Type.hasMany(Cake)
Cake.belongsTo(Type)

Type.hasMany(Price)
Price.belongsTo(Type)

module.exports = {User, Cake, Order, OrderCake, Price, Type}

