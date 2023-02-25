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

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

let persons = [
]
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }




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


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        } else {
            response.status(404).end()
        }
        
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === "") {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number || false,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })



app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
    
})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
        name: body.name,
        number: body.number
      }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

/*
const generateId = () => {
    const newId = Math.floor(Math.random() * (9999999999999-1) + 1)
    
    return newId
  }
*/


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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }


app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})