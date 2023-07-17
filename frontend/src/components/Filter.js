const Filter = ( {filterName, handleFilter} ) => {
    
    return (
        <div>
            <form className = "filter-by-name" onSubmit = {(e) => e.preventDefault()}>
                <label htmlFor = "filter">Filter by Name</label>
                <input 
                    type = "text" 
                    id = "filter" 
                    value = {filterName} 
                    onChange = {handleFilter}>
                </input>
            </form>
        </div>
    )
}

export default Filter;