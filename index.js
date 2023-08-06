require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/people')


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//activate json-parser
app.use(express.json())

//allow cross-origin resource sharing
app.use(cors())

//serve frontend build to browser statically
app.use(express.static('build'))

//create custom token to capture POST object in morgan logger 
morgan.token('person', function getPerson(req) {
  return JSON.stringify(req.body)
})

//use morgan logger based on tiny configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

//get all entries
app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.log('failed to get contacts: ', error.mesage)
      })
})

//get any entry
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => id === person.id)
  if(!person) {
    res.status(404).end('entry not found')
  }
  else {
    res.json(person)
  }
  
})

//delete an entry
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => id === person.id)
  if(!person) {
    return res.status(404).end('entry not found')
  }
  persons = persons.filter(person => id !== person.id)
  res.json(persons)
})

//create an entry

isUniqueEntry = (entry) => {
  const existingPerson = persons.find(
    person => person.name.toLowerCase() === entry.name.toLowerCase())
  if(existingPerson) {
    return false
  }
  else {
    return true
  }
}

const generateId = () => {
  const id = Math.floor(Math.random()*50000);
  return id;
}

app.post('/api/persons', (request, response) => {
  const userEntry = request.body
  if(!userEntry.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if(!userEntry.number) {
    return response.status(400).json({
      error: "number missing"
    })
  }

  if(isUniqueEntry(userEntry)) {
    const newPerson = {...userEntry, id: generateId()}
    persons = persons.concat(newPerson)
    response.json(newPerson)
  }
  else response.status(400).json({
    error: "person with name already exists"
  })
})


//get info
app.get('/info', (req, res) => {
 const reqTime = new Date()
 const entries = persons.length

 res.send(`<p>Phonebook has info for ${entries} people</p><p>${reqTime}</p>`)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
  console.log(`server started at port ${PORT}`)
})




