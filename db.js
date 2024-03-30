const mongoose = require('mongoose')
const dotenv = require('dotenv') //for .env file
dotenv.config({path: './config/.env'})
const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/billingsystem`

//establishing mongodb connection
const connectDb = async ()=> {
    try {
        const conn = await mongoose.connect(url, {

        })
        console.log('MongoDB connected')
    }catch (err){
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDb