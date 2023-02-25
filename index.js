const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

let persons = [
]

app.get('/info', (request, response) => {
    var date = new Date(Date.now())
    response.send('<p> Phonebook has info for ' + persons.length +' people</p>'
    +'<p>'+ date +'</p>')
    
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(note => {
        response.json(note)
    })
})




app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

/*
const generateId = () => {
    const newId = Math.floor(Math.random() * (9999999999999-1) + 1)
    
    return newId
  }
*/

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number || false,
    })
  
    person.save().then(savedNote => {
      response.json(savedNote)
    })
  })
/*
app.post('/api/persons', (request, response) => {
    const newperson = request.body

    if(persons.some(person => person.name === newperson.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    if(!newperson.name || !newperson.number){
        return response.status(400).json({ 
            error: 'Name or number missing' 
          })
    }
    if (newperson.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }

    const person = {
        //id: generateId(),
        name: newperson.name,
        number: newperson.number
        
    }

    console.log("tulee tänne")
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
})*/

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})