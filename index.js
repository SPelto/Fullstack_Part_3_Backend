const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

const originalSend = app.response.send

app.response.send = function sendOverWrite(body) {
    originalSend.call(this, body)
    this.__custombody__ = JSON.stringify(body).replace(/[\\]/g, "").replace(/,"id":\d+/g, "").slice(1, -1)
}

morgan.token('res-body', function (_req, res) {
    return res.__custombody__
})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'));



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const nPeople = persons.reduce(
        (sum, person) => sum + 1,
        0
    )

    const date = new Date().toISOString()
    response.send(`<p> Phonebook has info for ${nPeople} people</p>
    <p>${date}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.send(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.floor(Math.random() * 100000)
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if (persons.some(person => person.number === body.number)) {
        return response.status(400).json({
            error: 'number must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})