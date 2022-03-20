import React, { useState, useEffect } from 'react'
import { getDatabase, ref, push, set, onValue, update } from "firebase/database";
import UsersRooms from './UsersRooms';
import SignOut from './SignOut';
import "./ChooseRoom.css"
import RoomForm from './RoomForm';
import { database } from './firebaseConfig';

function ChooseRoom(props) {
    const { setChooseRoom, setAuthenticated, userName, roomDataArray, arrRoomNames, newAddUserRoomRef, newChatroomsRef,
            arrUsersRooms, chatroomNamesID, arrUsersRoomsData, usersRooms } = props;
            
    const [roomName, setRoomName] = useState("")
    const [roomPassword, setRoomPassword] = useState("")
    const [attemptName, setAttemptName] = useState("")
    const [attemptPassword, setAttemptPassword] = useState("")
    const [error, setError] = useState("")


    // used to create a new chatroom.
    const createChatroomRef = ref(database, 'chatrooms/' + roomName + "/messages");

    const newCCRef = push(createChatroomRef);

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

        var roomMembers = []
        roomMembers.push(props.userName)

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
                createdBy: userName,
                members: [userName]
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
                    let roomID = chatroomNamesID[indexOfRoomID]

                    var roomMembers = []

                    // gets all of the members out of a room in array form
                    for (let i = 0; i < roomDataArray[indexOfRoomID].members.length; i++){
                        roomMembers.push(" " + roomDataArray[indexOfRoomID].members[i])
                    }
                    roomMembers.push(" " + props.userName)
                    

                    set(newAddUserRoomRef, {
                        roomName: attemptName,
                        password: attemptPassword
                    });

                    const chatroomsMembersRef = ref(database, "chatroomNames/" + roomID);

                    update(chatroomsMembersRef, {
                        members: roomMembers
                    });
                    setChooseRoom(attemptName)
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
        alert(error)
    }

    return (
        <div className='choose__room'>
            <div className='choose__room--heading'>
                <div className='choose__room--heading--left'>
                    <h1>Hello, {userName}</h1>
                    <h2>Where'd you like to meet?</h2>
                </div>
                <div className='choose__room--heading--right'>
                    <SignOut setAuthenticated={setAuthenticated}/>
                    <button className="button--black" type="submit" onClick={() => {setChooseRoom("main")}}>Join the main room</button>
                </div>
            </div>
            <div className='choose__room--forms'>
                <RoomForm purposeOfForm={"Make a new room"} 
                    handlingFunction={handleNewRoom} 
                    nameValue={roomName} 
                    namePlaceholder={"New room name"}
                    passwordValue={roomPassword} 
                    passwordPlaceholder={"Create a password"}
                    setStateName={setRoomName} 
                    setStatePassword={setRoomPassword} 
                    submitButtonValue={"Create"}/>

                <RoomForm purposeOfForm={"Join an existing room"} 
                    handlingFunction={handleRoomJoin} 
                    nameValue={attemptName} 
                    namePlaceholder={"Room name"}
                    passwordValue={attemptPassword} 
                    passwordPlaceholder={"Room password"}
                    setStateName={setAttemptName} 
                    setStatePassword={setAttemptPassword} 
                    submitButtonValue={"Enter"}/>
            </div>
            <div className='choose__room--user__rooms'>
                {console.log(arrUsersRoomsData)}
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