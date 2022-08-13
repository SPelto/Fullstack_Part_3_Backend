const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://SPelto:${password}@spelto.40ga3dm.mongodb.net/personApp?retryWrites=true&w=majority`

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