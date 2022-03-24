import React from 'react'
import { useEffect, useState } from 'react';
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import ChatBubble from './ChatBubble';
import SignOut from './SignOut';
import "./Chat.css"
import ChooseRoom from './ChooseRoom';

function Chat(props) {

    const { setChooseRoom, setAuthenticated } = props;

    const [message, setMessage] = useState("");
    const [roomMessages, setRoomMessages] = useState([])

    const db = getDatabase();
    const chatroomRef = ref(db, 'chatrooms/' + props.room + "/messages");


    const handleAddingMsg = (e) => {
        e.preventDefault();
        const newChatroomRef = push(chatroomRef);

        set(newChatroomRef, {
            message: message,
            sender: props.userName,
            profile__pic: props.profilePic,
            uid: props.uid,
            timestamp: Date.now()
        });
        setMessage("")
    }

    useEffect(() => {
        onValue(chatroomRef, (snapshot) => {
            const data = snapshot.val();
            setRoomMessages(roomMessages)
            setRoomMessages(data)
        });
    }, [props.room])


    if (props.room != "main"){
        // used to get the index of roomDataArray element with the field of roomName == attemptName
        let indexOfRoomID = props.arrUsersRoomsData.findIndex(id => id.roomName == props.room);

        var roomMembers = []

        // gets all of the members out of a room in array form
        for (let i = 0; i < props.arrUsersRoomsData[indexOfRoomID].members.length; i++){
            roomMembers.push(props.arrUsersRoomsData[indexOfRoomID].members[i] + " ")
        }
    }

  return (
    <div className='chat'>
        <div className='chat--nav'>
            <h2>Your rooms</h2>
            <div className='chat--nav--rooms'>
                <button className="chat--nav--rooms--item" onClick={(e)=> setChooseRoom("main")}>main</button>
            { props.arrUsersRoomsData !== null && props.arrUsersRoomsData !== "" &&
                    props.arrUsersRoomsData.map((roomInfo, index) => (
                        <button
                            className="chat--nav--rooms--item"
                            onClick={(e)=> setChooseRoom(roomInfo.roomName)}
                            key = {index}
                        >
                            {roomInfo.roomName}    
                        </button>
                    ))
                }
            </div>
            <div className='chat--nav--btns'>
                <button className='button--black' type="submit" onClick={() => {setChooseRoom(true)}}>Join a new room</button>
                <SignOut setAuthenticated={setAuthenticated}/>
            </div>
        </div>
        <div className='chat--room'>
            <div className='chat--room--top'>
                <button className='button--black' type="submit" onClick={() => {setChooseRoom(true)}}>Join a new room</button>
                <SignOut setAuthenticated={setAuthenticated}/>
            </div>
            <div className='chat--room--container'>
                    <div className='chat--room--container--chats'>
                        {roomMessages != null &&
                            Object.keys(roomMessages).reverse().map((messageData, index) => 
                            <ChatBubble
                                key = {index}
                                uid = {props.uid}
                                senderUid = {roomMessages[messageData].uid}
                                profilePic = {roomMessages[messageData].profile__pic} 
                                userName = {roomMessages[messageData].sender}
                                message = {roomMessages[messageData].message}
                                time = {roomMessages[messageData].timestamp}
                            /> 
                            )
                        }
                    </div>
                    <div className='chat--room--container--heading'>
                    <h2>{props.room}</h2>
                        {props.room != "main" &&
                            <div className='chat--room--container--heading--members'>
                                <h3>In this room:</h3>
                                <div>{roomMembers}</div>
                            </div>
                        }
                </div>
            </div>
            <form className="chat--room--send" onSubmit={(e) => { handleAddingMsg(e) }}>
                <input required 
                    type="text" 
                    value={message} 
                    placeholder='type your message' 
                    onChange={(e)=> setMessage(e.target.value)}
                    className='chat--room--send--input'
                >
                </input>
                <input className='chat--room--send--submit' type="submit" value="Send"></input>
            </form> 
        </div>
    </div>
  )
}

export default Chat