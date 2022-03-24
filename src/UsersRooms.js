import React from 'react'
import "./UsersRooms.css"

function UsersRooms(props) {
    const { setChooseRoom } = props;
  return (
    <div className='users__rooms'>
        <div className='users__rooms--heading'>
            <h4>{props.roomName}</h4>
            <p>Created by: {props.roomCreator}</p>
        </div>
        <div className='users__rooms--members'>
          <p>Members: {props.members}</p>
        </div>
        <button className="users__rooms--join--button" type="submit" onClick={() => {setChooseRoom(props.roomName)}}>Join</button>
    </div>
  )
}

export default UsersRooms