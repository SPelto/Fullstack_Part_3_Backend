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
    minlength: 8,
    required: true
  }
})

// eslint-disable-next-line no-unused-vars
const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)