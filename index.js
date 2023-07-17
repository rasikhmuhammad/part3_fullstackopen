const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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

//create custom token to capture POST object in morgan logger 
morgan.token('person', function getPerson(req) {
  return JSON.stringify(req.body)
})

//use morgan logger based on tiny configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

//get all entries
app.get('/api/persons', (req, res) => {
    res.json(persons)
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

const PORT = 3001;
app.listen(PORT, ()=> {
  console.log(`server started at port ${PORT}`)
})




