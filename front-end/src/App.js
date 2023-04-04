import './App.css';
import React, { useState, useEffect } from 'react';
import ChoreList from './components/choreList.js';
import ChoreForm from './components/SendChore.js';

const App = () => {
const [chores, setChores] = useState([]);


useEffect(()=> {
  fetch('http://localhost:8100/api/chores/')
  .then((response) => {
    const isJson = response.headers.get('content-type')?.includes('application/');
    return isJson && response.json();
})
    // .then(data => setChores(data))
    .then((data)=>{
      setChores(data)
    })
    .catch(error => console.error(error));
},[]);

const addChore = (newChore) => {
  setChores([...chores, newChore]);
};

  return !chores.length ? (
    <h1 className='fc1'>LOADING</h1>
  ) : (
    <div className="tc">
        <h1 id='todo' className='f1'>To Do List</h1>
        <ChoreForm onAddChore= { addChore }/>
        <ChoreList chores={ chores }/>
    </div>
  );
}

export default App;

