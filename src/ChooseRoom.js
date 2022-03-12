import React, { useState, useEffect } from 'react'
import { getDatabase, ref, push, set, onValue, update } from "firebase/database";
import UsersRooms from './UsersRooms';
import SignOut from './SignOut';
import "./ChooseRoom.css"
import { auth } from './firebaseConfig';

function ChooseRoom(props) {
const { setChooseRoom, userAccExists, setAuthenticated, userName } = props;
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
var roomDataArray = (Object.keys(realRoomName).map((roomData => (realRoomName[roomData]))))

if(userAccExists){
    // an array of objects of all of the users room names and passwords
    Object.keys(usersRooms).map((names => arrUsersRooms.push(usersRooms[names])))
}


// used get the data of each room that a user has access to
var arrUsersRoomsData = [];

if(roomDataArray){
    for (let i in roomDataArray) {
        // arrUsersRooms holds roomName and password in an object
        for(let j in arrUsersRooms){
            // checks that the roomName in arrUsersRooms is in all roomNames
            if (roomDataArray[i]["roomName"] === arrUsersRooms[j]["roomName"]) {
                // pushes all roomData info for each room that a user has access to
                arrUsersRoomsData.push(roomDataArray[i])
            }
        }
    }
}

const checkPassword = (attemptName, attemptPassword) => {
    for (let i in roomDataArray) {
        // checks if the inputted name matches an actual room
        if (roomDataArray[i]["roomName"] === attemptName) {
            // checks if the inputted password matches the actual password of said room.
            if(roomDataArray[i]["password"] === attemptPassword){
                return true;
            }
        }
    }
}

const handleNewRoom = (e) => {
    e.preventDefault();

    var members = []
    members.push(props.userName)

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
            members: members
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
            for(let i in arrUsersRooms){
                // checks that the roomName in arrUsersRooms is in all roomNames
                if (arrUsersRooms[i]["roomName"] === attemptName) {
                    return setChooseRoom(attemptName)
                }
            }
            if(checkPassword(attemptName, attemptPassword)){


                // used to get the index of roomDataArray element with the field of roomName == attemptName
                let indexOfRoomID = roomDataArray.findIndex(id => id.roomName == attemptName);

                // the auto generated id for the room == attemptname in chatRooms node
                let roomID = Object.keys(realRoomName)[indexOfRoomID]

                var members = []

                console.log(roomDataArray[indexOfRoomID].members.length)
                console.log(roomDataArray[indexOfRoomID].members)

                // gets all of the members out of a room in array form
                for (let i = 0; i < roomDataArray[indexOfRoomID].members.length; i++){
                    console.log(indexOfRoomID)
                    console.log(i + " " + members)
                    members.push(roomDataArray[indexOfRoomID].members)
                }

                members.push(props.userName)

                set(newAddUserRoomRef, {
                    roomName: attemptName,
                    password: attemptPassword
                });

                const dbRef = ref(db, "chatroomNames/" + roomID + "/members")

                set(dbRef, {members: members}).then(() => {
                    setChooseRoom(attemptName)
                }).catch((e) => {
                  console.log(e);
                })

                }
                
            else{
                setError("Oops, you've entered the wrong password, please try again.")
            }
        }
        else{
            setError("This room name doesn't exist")
        } 
        setAttemptPassword("")
        setAttemptName("")    
}


if(error != ""){
    console.log(error)
}


  return (
    <div className='choose__room'>
        <SignOut setAuthenticated={setAuthenticated}/>
        <h1>Hello, {userName}</h1>
        <h2>Where'd you like to meet?</h2>
        <button className="button--grey" type="submit" onClick={() => {setChooseRoom("main")}}>Join the main room</button>
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
        <div className='choose__room--user__rooms'>
            { usersRooms != null && usersRooms != "" &&
                arrUsersRoomsData.map((roomInfo, index) => (
                    <UsersRooms 
                        key = {index}
                        roomName = {roomInfo.roomName}
                        roomCreator = {roomInfo.createdBy}
                        members = {roomInfo.members.toString()}
                        setChooseRoom = {setChooseRoom}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default ChooseRoom