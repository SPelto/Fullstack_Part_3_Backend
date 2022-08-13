require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

if (name && number) {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

if (password && !(name || number)) {
    let message = "phonebook:"

    Person.find({}).then(result => {
        result.forEach(person => {
            message += `\n${person.name} ${person.number}`
        })
        console.log(message)
        mongoose.connection.close()
    })
}