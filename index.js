const express = require('express')
const app = express()

const persons = [
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

  console.log(person)
  persons = persons.filter(person => id !== person.id)
  res.json(persons)
  
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




