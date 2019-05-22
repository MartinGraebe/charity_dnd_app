import React from 'react'


function WheelSelectItem(props){

    return(
        <div className="select-wrapper">
            <div className="select-item">
                <input 
                    type="checkbox"
                    checked={props.item.inUse}
                    onChange={()=> props.handleChange(props.item.id)}
                    />
                <p className="itemInList">{props.item.label}</p>
            
        
            </div>
        </div>
    )
}
export default WheelSelectItem