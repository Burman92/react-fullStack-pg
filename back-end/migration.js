const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ToDoList',
    password: 'password',
    port: 5432
});

/*------------CREATING THE TODO LIST--------------- */

pool.query(`CREATE TABLE IF NOT EXISTS chores(
    id SERIAL PRIMARY KEY,
    name VARCHAR (20),
    chore TEXT,
    dayPosted DATE,
    dayCompleted DATE
)`, (error, data)=>{
    if(error){
        console.log('Table was not created:', error)
    } else{
        console.log('TABLE CREATED', data)
    }
})