import React, { useState } from 'react';

const ChoreForm = ({ onAddChore }) => {
    const [name, setName] = useState('');
    const [chore, setChore] = useState('');
    const [dayPosted, setDayPosted] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      fetch('http://localhost:8100/api/chores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          chore,
          dayPosted
        })
      })
        .then(response => response.json())
        .then(data => {
          onAddChore(data);
        })
        .catch(error => console.error(error));
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" placeholder="'Name'" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Chore:
          <input type="text" value={chore} placeholder="'Chore'" onChange={(e) => setChore(e.target.value)} required/>
        </label>
        <label>
          Day Posted:
          <input type="text" value={dayPosted} placeholder="'0000-00-00'" onChange={(e) => setDayPosted(e.target.value)} required/>
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  };
  
  export default ChoreForm;