import React, { useState, useEffect } from 'react'
import { getDatabase, ref, push, set, onValue, update, child } from "firebase/database";
import UsersRooms from './UsersRooms';
import SignOut from './SignOut';
import "./ChooseRoom.css"
import RoomForm from './RoomForm';

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
            const chatroomsData = snapshot.val();

            // an array of objects including a rooms name and password, amongst other data.
            var roomDataArray = Object.values(chatroomsData)

            setRealRoomName(roomDataArray);
        });

    }, [])

    var roomDataArray = realRoomName
    console.log(JSON.stringify(roomDataArray))

    // an array of all the room names 
    if(realRoomName != ""){
        realRoomName.forEach((object) => {
            arrRoomNames.push(object.roomName)
        });
    }

    if(userAccExists){
        // an array of objects of all of the users room names and passwords
        Object.keys(usersRooms).map((names) => {
            if(usersRooms[names] != "main"){
                arrUsersRooms.push(usersRooms[names])
            }
        }) 
        console.log(arrUsersRooms)
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
                members: userName
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
                    console.log(roomID)
                    var roomMembers = []

                    console.log(roomDataArray[indexOfRoomID])
                    console.log(roomDataArray[indexOfRoomID].members)
                    console.log(roomDataArray[indexOfRoomID].members.length)

                    // gets all of the members out of a room in array form
                    for (let i = 0; i < roomDataArray[indexOfRoomID].members.length; i++){
                        console.log(indexOfRoomID)
                        roomMembers.push(roomDataArray[indexOfRoomID].members[i])
                        console.log(i + " " + roomMembers)
                    }
                    console.log(roomMembers)
                    roomMembers.push(props.userName)
                    console.log(roomMembers)

                    set(newAddUserRoomRef, {
                        roomName: attemptName,
                        password: attemptPassword
                    });


                    const membersRef = ref(db, "chatroomNames/" + "-My0pwcn9RvOh1Uc10IK")

                    const newMembersRef = push(membersRef)

                    update(newMembersRef, {
                        members: roomMembers
                    });

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