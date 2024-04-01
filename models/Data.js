const mongoose = require('mongoose')

const DataSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        default: Date.now
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    afterDiscount: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('billingdatacollection', DataSchema, 'billingdatacollection')