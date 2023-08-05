const mongoose = require('mongoose')

//check if password is provided by user at command line
if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://rasikhmuhammad:${password}@fullstackopen.y3ypkee.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(uri)

//define phonebook contact schema
const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

//print all existing entries
if(process.argv.length === 3){
    Person.find({}).then( (result) => {
        result.forEach(person => {
            console.log(`${person.name}  ${person.number}`)
        })
     mongoose.connection.close()   
    })
}

//add new person to phonebook from command line
//check if name and number of new person is provided at command line
if(process.argv.length > 3) {
    if(process.argv.length !== 5){
        console.log('enter both name and password as argument')
        process.exit(1)
    }

    if(process.argv.length > 5)
    console.log('too many arguments provided, any data except name and number will be ignored')

    const person = new Person({
        id: Math.floor(Math.random()*50000),
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(resutl => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

