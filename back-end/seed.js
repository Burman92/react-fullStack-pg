const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host:'127.0.0.1',
    database: 'ToDoList',
    password: 'password',
    port: 5432
})

/*------------SEEDING MY DATA--------------------- */
pool.query(`SELECT * FROM chores`, (error, data)=>{
    if(error){
        console.error('ERROR RETRIEVING CHORE TABLE:', error)
        return;
    }
    if(!data || !data.rows || data.rows.length ===0){
        pool.query(`INSERT INTO chores(name, chore, dayPosted, dayCompleted) VALUES
        ('James', 'dishes', now(), NULL ),
        ('John', 'trash', '2023-04-08', NULL ),
        ('Jacob', 'laundry', now(), now() ),
        ('Jordan', 'pick up sister', now(), '2023-03-31' ) RETURNING *`,(error, data)=>{
            if(error){
                console.log('Chores not added: ', error)
            } else {
                console.log('Chores added:', data)
            }
        })
    }
})