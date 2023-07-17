const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, handleSubmit}) => {
    return (
        <form onSubmit = {handleSubmit} >
            <h2>Create Contact</h2>
            <div>
                name: <input value = {newName} onChange = {handleNameChange} />
            </div>
            <div>
                Number: <input value = {newNumber} onChange = {handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
      </form>
    )
}

export default PersonForm;