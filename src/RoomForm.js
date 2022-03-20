import React from 'react'
import "./RoomForm.css"

function RoomForm(props) {
    const { purposeOfForm, handlingFunction, nameValue, namePlaceholder, passwordValue, passwordPlaceholder, setStateName, setStatePassword, submitButtonValue } = props;

  return (
        <form className="room__form" onSubmit={(e) => {handlingFunction(e)}}>
            <div className='room__form--label'>
                <label>{purposeOfForm}</label>
            </div>
            <div className='room__form--inputs'>
                <input required 
                type="text" 
                value={nameValue} 
                placeholder={namePlaceholder}
                onChange={(e)=> setStateName(e.target.value)}
                >
                </input>
                <input required 
                type="text" 
                value={passwordValue} 
                placeholder={passwordPlaceholder}
                onChange={(e)=> setStatePassword(e.target.value)}
                >
                </input>
                <input className='room__form--submit' type="submit" value={submitButtonValue}></input>
            </div>
        </form>   
    )
}

export default RoomForm