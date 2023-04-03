const express = require('express');
const app = express();
app.use(express.json());
const port = 8100;
const { Pool } = require('pg');
const DB_HOST = "127.0.0.1" ;
const cors = require('cors');
app.use(cors());
const pool = new Pool({
    user: 'postgres',
    host: DB_HOST,
    database: 'ToDoList',
    password: 'password',
    port: 5432
});

/*---------------GET WHOLE LIST--------------- */
app.get("/api/chores", (req, res, next)=>{
    pool.query(`SELECT * FROM chores`, (error, data)=>{
        if(error){
            return next(error);
        }
        const chores = data.rows;
        res.send(chores);
    })
})

/*--------------GET SPECEFIC CHILD LIST---------- */
app.get(`/api/chores/:name`, (req, res, next)=>{
    const name = req.params.name //use req.params instead of body as data is passed to server via url.
    pool.query(`SELECT * FROM chores WHERE name = $1`,[name], (error, data)=>{
        if(!name){
            res.status(404).send('No child found with that name.')
        }
        if(error){
            return next(error);
        }
        const chores = data.rows
        if(chores){
            res.send(chores)
        } else {
            res.status(404).send('No child found with that name.')
        }
    })
})

/*---------------CREATING A NEW CHORE FOR A CHILD------------ */
app.post(`/api/chores`, (req, res, next)=>{
    const name = req.body.name;
    const chore = req.body.chore;
    const dayPosted = req.body.dayPosted;
    // const dayCompleted = req.body.dayCompleted;
    if(!name || !chore || !dayPosted){
        return res.status(404).send('please input information correctly');
    } else {
        pool.query(`INSERT into chores(name, chore, dayPosted) VALUES ($1, $2, $3) RETURNING *;`, [name, chore, dayPosted], (error, data)=>{
            if(error){
                console.log('Did not create new chore: ' , error)
            }
            let newChore = data.rows[0];
            res.status(200).send(newChore);
        })
    }
})

/*------------------Update the chore/dayposted/daycompleted----------------------- */
app.patch("/api/chores/:name",(req,res,next)=>{
    const name = req.params.name;
    const chore = req.body.chore;
    const dayPosted = req.body.dayPosted;
    const dayCompleted = req.body.dayCompleted;
    pool.query("SELECT * FROM chores WHERE name =$1", [name], (error, data)=>{
        if(error){
            return res.status(404).send("No child found with that name.");
        }
        const update = data.rows[0];
        if(!update){
            res.status(404).send("No child found with that name.")
                }
                // const updatedName = name || update.name;
                const updatedChore = chore || update.chore;
                const updateDayPosted = dayPosted || update.dayPosted;
                const updateDayCompleted = dayCompleted || update.dayCompleted;
    pool.query(`UPDATE chores SET chore = $1, dayPosted = $2, dayCompleted = $3 WHERE name = $4 RETURNING *`, [updatedChore, updateDayPosted, updateDayCompleted, name], (error, information)=>{
        if(error){
            console.log(error)
            return res.status(404).send("Error update not accepted", error);
        }
        res.send(information[0]);
    })
    })
})


app.use((error, req, res, next)=>{
    console.error(error.stack);
    res.status(404).send({error: error})
})

app.listen(port, ()=>{
    console.log(`We are live on ${port}!`)
    console.log('db host: ', DB_HOST)
    console.log('port', port)
})