const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 4,
        required: true
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)