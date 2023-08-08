require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

//connect to databse
console.log('connecting to ', process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        console.log('connected to database')
    })
    .catch(error => {
        console.log('error connecting to databse:', error.message)
    })

//custom validator for number
function validator(number) {
    const phoneRegex = /^[0-9]{2,3}-[0-9]{6,}$/;
    return phoneRegex.test(number)
}

//create schema for storing a person in phonebook database in the people collection
const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: [
            validator,
            "is not a valid number"
        ]
    }
})

//exclude _v and _id in database response to frontend
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)