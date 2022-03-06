import React, { useState, useEffect } from 'react'
import { getDatabase, ref, push, set, onValue } from "firebase/database";

function ChooseRoom(props) {
const { setChooseRoom } = props;
const [roomName, setRoomName] = useState("")
const [roomPassword, setRoomPassword] = useState("")
const [attemptName, setAttemptName] = useState("")
const [attemptPassword, setAttemptPassword] = useState("")
const [error, setError] = useState("")
const [realRoomName, setRealRoomName] = useState("")
const [usersRooms, setUsersRooms] = useState("")

var arrRoomNames = []
var arrUsersRooms = []


const db = getDatabase();

// used to create a new chatroom.
const createChatroomRef = ref(db, 'chatrooms/' + roomName + "/messages");

// used to add the joined room to the user's account.
const addUserRoomRef = ref(db, 'users/' + props.uid + "/rooms");

// used to check if a room name exists, and it's password.
const chatroomsRef = ref(db, 'chatroomNames');

// used to add to lists of respective refs.
const newCCRef = push(createChatroomRef);
const newAddUserRoomRef = push(addUserRoomRef);
const newChatroomsRef = push(chatroomsRef);



useEffect(() => {
    onValue(addUserRoomRef, (snapshot) => {
        const data = snapshot.val();
        setUsersRooms(data)
    });

    // gets the names of all the rooms on the app
    onValue(chatroomsRef, (snapshot) => {
        const data = snapshot.val();
        setRealRoomName(data);
    });

}, [])

// an array of all the room names 
Object.keys(realRoomName).map((names => arrRoomNames.push(realRoomName[names].roomName)))

// an array of objects including a rooms name and password, amongst other data.
var roomData = (Object.keys(realRoomName).map((roomData => (realRoomName[roomData]))))

var members = []

// gets all of the members out of a room in array form
for (let i = 0; i < roomData.length; i++){
    members.push(roomData[i].members)
}

console.log(members)
 
// an array of objects of all of the users room names and passwords
Object.keys(usersRooms).map((names => arrUsersRooms.push(usersRooms[names])))

console.log(arrUsersRooms)



const checkPassword = (attemptName, attemptPassword) => {
    for (let i in roomData) {
        console.log(1)
        if (roomData[i]["roomName"] === attemptName) {
            if(roomData[i]["password"] === attemptPassword){
                return true;
            }
        }
    }
}

const handleNewRoom = (e) => {
    e.preventDefault();

    if(!arrRoomNames.includes(roomName)){
        set(newCCRef, {
            message: "Welcome, to invite people to the room, share the room name and password with them.",
            sender: "Admin"
        });
        set(newAddUserRoomRef, {
            roomName: roomName,
            password: roomPassword
        });
        set(newChatroomsRef, {
            roomName: roomName,
            password: roomPassword,
            createdByUid: props.uid,
            createdBy: props.userName,
            members: [props.userName]
        });
        setRoomName("")
        setRoomPassword("")
        setChooseRoom(roomName)
    }
    else{
        setError("Sorry, the room name you entered already exists, try something else.")
    }
}

const handleRoomJoin = (e) => {
    e.preventDefault();

    if(arrRoomNames.includes(attemptName)){
        if(checkPassword(attemptName, attemptPassword)){

            set(newAddUserRoomRef, {
                roomName: roomName,
                password: roomPassword
            });

            set(newChatroomsRef, {
                members: [props.userName]
            });

            setChooseRoom(attemptName)

            setAttemptPassword("")
            setAttemptName("")

        }
        else{
            setError("Oops, you've entered the wrong password, please try again.")
            setAttemptPassword("")
            setAttemptName("")
        }
    }
    else{
        setError("This room name doesn't exist")
        setAttemptName("")
        setAttemptPassword("")
    }
}

if(error != ""){
    console.log(error)
}


  return (
    <div className='choose__room'>
        <h2>Where'd you like to meet?</h2>
        <button type="submit" onClick={() => {setChooseRoom("main")}}>Join the main room</button>

        <form className="new--room" onSubmit={(e) => {handleNewRoom(e)}}>
            <label>Make a new room</label>
            <input required 
                type="text" 
                value={roomName} 
                placeholder="New room name" 
                onChange={(e)=> setRoomName(e.target.value)}
            >
            </input>
            <input required 
                type="text" 
                value={roomPassword} 
                placeholder="Create a password" 
                onChange={(e)=> setRoomPassword(e.target.value)}
            >
            </input>
            <input className='add__task--submit' type="submit" value="Create"></input>
        </form> 
        <form className="join--room" onSubmit={(e) => {handleRoomJoin(e)}}>
            <label>Join an existing room</label>
            <input required 
                type="text" 
                value={attemptName} 
                placeholder="Room name" 
                onChange={(e)=> setAttemptName(e.target.value)}
            >
            </input>
            <input required 
                type="text" 
                value={attemptPassword} 
                placeholder="Room password" 
                onChange={(e)=> setAttemptPassword(e.target.value)}
            >
            </input>
            <input type="submit" value="Enter"></input>
        </form> 
        { usersRooms != null && usersRooms != "" &&
            arrUsersRooms.map((roomInfo) => (
                <div key={roomInfo.roomName}>
                    <p>{roomInfo.roomName}</p>
                </div>
            ))
        }
    </div>
  )
}

export default ChooseRoom