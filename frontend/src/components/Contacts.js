const Contact = ({person, handleDelete}) => {
    return (
      <p>
        {person.name} - {person.number} 
        <button 
          onClick = { () => handleDelete(person.id, person.name)}>Delete 
        </button> 
      </p>
    )
  }
  
  const Contacts = ({persons, filterActive, filterName, handleDelete}) => {
  
    if(!filterActive) {
      return (
        <div>
          {persons.map( (person,index) => 
            <Contact 
              key = {person.id} 
              person = {person}
              handleDelete = {handleDelete} 
            />
          )}
       </div>
      )
    }
    else {
        const filteredPersons = persons.filter( (person) => {
            return (
              
                person.name.toLowerCase()
                .includes(filterName.toString().toLowerCase())
            )
        })
        return (
            <div>
            {filteredPersons.map( (person) => 
              <Contact 
                key = {person.id} 
                person = {person}
                handleDelete = {handleDelete}
              />
            )}
      </div>
      )
    }
  
  }

  export default Contacts;
  