import React from "react";
import SingleChore from "./chore.js";

const ChoreList = ({ chores }) => {
    const choreArray = chores.map((chore) => {
        return (
            <SingleChore key = {chore.id} 
            id = {chore.id} 
            name = {chore.name} 
            chore = {chore.chore}
            dayPosted = {chore.dayposted}
            // dayCompleted = {chore.daycompleted}
            />)
        })
    return(
        <div>
            { choreArray }
        </div>
    )
}

export default ChoreList;