const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()
const Person = require('./models/person')

const originalSend = app.response.send



app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body)
  this.__custombody__ = JSON.stringify(body).replace(/[\\]/g, '').replace(/,"id":\d+/g, '').slice(1, -1)
}

morgan.token('res-body', function (_req, res) {
  return res.__custombody__
})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'))




app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(result => {
    const message = `<p> Phonebook has info for ${result.length} people</p>
        <p>${new Date()}</p>`
    response.send(message)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const message = `<p> Phonebook has info for ${result.length} people</p>
          <p>${new Date()}</p>`
    response.send(message)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.send(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.send({
          'name': person.name,
          'number': person.number,
          'id': person._id
        })
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  newPerson.save().then(person => {
    response.send(person)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.send(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const number = request.body.number
  const filter = { _id: request.params.id }
  const update = { number: number }
  const opt = { new: true, runValidators: true, context: 'query' }
  Person.findOneAndUpdate(filter, update, opt
  ).then(result => {
    response.send(result)
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})