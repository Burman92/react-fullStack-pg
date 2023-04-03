import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
const [data, setData] = useState([]);

useEffect(()=> {
  fetch('http://localhost:8100/api/chores/')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
},[]);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        { data.map(item => 
          <p key={item.id}>
          {item.name}
          {console.log(data)}
          </p>) }
      </header>
    </div>
  );
}

export default App;
