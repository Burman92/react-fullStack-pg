import React from "react";
import 'tachyons'

const SingleChore = (props) =>{
    const { name, chore, dayPosted, dayCompleted } = props
    return(
        <div id ="card" className='tc dib br2 pa2 ma2 grow bw2 shadow-5'>
            <img src={`https://robohash.org/${name}`} alt='robot face'/> 
            <div id="insideCard">
                <h2>{ name }</h2>
                <h2>{ chore }</h2>
                <h2>{ dayPosted }</h2>
                <h2>{ dayCompleted }</h2>
            </div>
        </div>
    )
  
}

export default SingleChore;