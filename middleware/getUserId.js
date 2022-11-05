const jwt = require('jsonwebtoken')

const getUserId = () => {
    return (req, res, next)=> {
        if (req.method === 'OPTIONS') {
            next()
        }

        try{
            const token = req.headers.authorization.split(' ')[1]

            if(!token){
                return res.status(401).json({message: 'Пользователь не авторизован'})
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decoded.id

            next()
        }catch (e) {
            res.status(401).json({message: `Your error: ${e}`})
        }
    }
}

module.exports = getUserId