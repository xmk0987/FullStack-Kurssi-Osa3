const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body));
  
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body '));





let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id:2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id:3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id:4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    var date = new Date(Date.now())
    response.send('<p> Phonebook has info for ' + persons.length +' people</p>'
    +'<p>'+ date +'</p>')
    
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})




app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const generateId = () => {
    const newId = Math.floor(Math.random() * (9999999999999-1) + 1)
    
    return newId
  }


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

    const person = {
        id: generateId(),
        name: newperson.name,
        number: newperson.number
        
    }
    persons = persons.concat(person)

    console.log(newperson)
    

    response.json(newperson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})