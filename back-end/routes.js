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

/*--------------DELETE SPECIFIC CHILD----------- */
app.delete('/api/chores/:name', (req, res, next) => {
    const name = req.params.name;
    pool.query("DELETE FROM chores WHERE name = $1 RETURNING *", [name], (error, data) =>{
          if(error){
            return next(error);
          }
          const deleted = data.rows[0];
          if(deleted){
            console.log("deletd row", deleted);
            res.send(deleted);
          } else {
            console.log("row not found")
            res.status(404).send('Did not execute request');
          }
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

function sqlUpdateSet(updateObj) {
    // Get the keys of the update object
    const keys = Object.keys(updateObj);
    // Create the SET clause string using the keys and their index as parameter placeholders
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    // Create an array of values corresponding to the keys in the update object
    const values = keys.map(key => updateObj[key]);
    // Return the SET clause string and the values array
    return { setString, values };
  }

  app.patch('/api/chores/:name', async (req, res) => {
    // Get the name from the request parameters
    const name = req.params.name;
    // Get the update object from the request body
    const updateObj = req.body;
  
    // Check if the update object is empty and return an error if it is
    if (Object.keys(updateObj).length === 0) {
      return res.status(400).send('No fields provided to update.');
    }
  
    // Use the sqlUpdateSet helper function to generate the SET clause and values for the SQL query
    const { setString, values } = sqlUpdateSet(updateObj);
    // Construct the SQL query using the generated SET clause and values
    const query = `UPDATE chores SET ${setString} WHERE name = $${values.length + 1} RETURNING *`;
    // Add the name to the values array
    values.push(name);
  
    // Execute the SQL query using the pg pool
    try {
      const { rows } = await pool.query(query, values);
      // Check if any rows were updated and return an error if not
      if (rows.length === 0) {
        res.status(404).send('No child found with that name.');
      } else {
        // Send the updated record as the response
        res.send(rows[0]);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Error update not accepted', error);
    }
  });


// app.patch("/api/chores/:name",(req,res,next)=>{
//     const name = req.params.name;
//     const chore = req.body.chore;
//     const dayPosted = req.body.dayPosted;
//     const dayCompleted = req.body.dayCompleted;
//     pool.query("SELECT * FROM chores WHERE name =$1", [name], (error, data)=>{
//         if(error){
//             return res.status(404).send("No child found with that name.");
//         }
//         const update = data.rows[0];
//         if(!update){
//             res.status(404).send("No child found with that name.")
//                 }
//                 // const updatedName = name || update.name;
//                 const updatedChore = chore || update.chore;
//                 console.log('updatechore: ', updatedChore);
//                 const updateDayPosted = dayPosted || update.dayPosted;
//                 console.log('updateDayPosted: ', updateDayPosted);
//                 const updateDayCompleted = dayCompleted || update.dayCompleted;
//                 console.log('updateDayCompleted: ', updateDayCompleted);
//     pool.query(`UPDATE chores SET chore = $1, dayPosted = $2, dayCompleted = $3 WHERE name = $4 RETURNING *`, [updatedChore, updateDayPosted, updateDayCompleted, name], (error, information)=>{
//         if(error){
//             console.log(error)
//             return res.status(404).send("Error update not accepted", error);
//         }
//         console.log(information[0]);
//         res.send(information[0]);
//     })
//     })
// })


app.use((error, req, res, next)=>{
    console.error(error.stack);
    res.status(404).send({error: error})
})

app.listen(port, ()=>{
    console.log(`We are live on ${port}!`)
    console.log('db host: ', DB_HOST)
    console.log('port', port)
})