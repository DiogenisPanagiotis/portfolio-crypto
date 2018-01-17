const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const modelSchema = new Schema({
    email: String,
    username: String,
    password: String,
    cryptocurrencies: []
})

const UserModel = mongoose.model('UserModel', modelSchema)

module.exports = UserModel
