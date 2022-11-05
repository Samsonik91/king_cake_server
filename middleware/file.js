const multer = require('multer')
const uuid = require('uuid')
const ApiError = require("../error/error.js")

const fileStorage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, './images')
    },
    filename(req, file, cb){
        const ext = file.mimetype.split('/')[1]
        cb(null, uuid.v4() + '.' + ext)
    }
})



const filter = (req, file, next) => {
    const types = ['image/png', 'image/jpeg', 'image/jpg']

    if(!file){
        return next(ApiError.badRequest("Поле 'изображение' обязательно к заполнению"))
    }

    if(types.includes(file.mimetype)){
        return next(null, true)
    }else{
        return next(ApiError.badRequest("Непоодерживаемый тип файла. Поддерживаемые типы файлов: 'jpg', 'jpeg', 'png'"))
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: filter
}).single('img')

module.exports = upload