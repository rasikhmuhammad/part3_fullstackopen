require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/people')

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

//get all entries from database
app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.log('database connection error: ', error.mesage)
      })
})

//get any entry from database
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(result => {
      console.log(result)
      if(!result) {
        res.status(404).end('entry not found')
      }
      else {
          res.json(result)
      }
    })
    .catch(error => {
      next(error)
    })
})

//delete an entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if(result) {
        response.status(200).end(`person with name ${result.name} deleted successfully`)
      }
      else {
        response.status(404).end(`person with id ${request.params.id} does not exist!`)
      }
    })
    .catch(error => {
      next(error)
    })
})

//create an entry
app.post('/api/persons', (request, response, next) => {
  const userEntry = request.body

  //check if user entry is valid
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

  Person.find({name: userEntry.name})
    .then(result => {
      if(result.length > 0) {
        response.status(400).end('entry exists')
      }
      else {
        const newPerson = new Person({
          name: userEntry.name,
          number: userEntry.number
        })
        newPerson.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => {
            next(error)
          })
      }
    })
    .catch(error => {
      next(error)
    })
}) //route handler

app.put('/api/persons/:id', (request, response, next) => {
  const updatedEntry = request.body
  Person.findByIdAndUpdate(request.params.id, updatedEntry, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.status(200).json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})


//get info
app.get('/info', (req, res) => {
 const reqTime = new Date()
 const entries = persons.length

 res.send(`<p>Phonebook has info for ${entries} people</p><p>${reqTime}</p>`)
})


//error handler middleware definition
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'Malformatted id'})
  }
  else if(error.name === "ValidationError") {
    return response.status(400).send({error: error.message})
  }

  next(error)
}
//load error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
  console.log(`server started at port ${PORT}`)
})




