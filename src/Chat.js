import React from 'react'
import { useEffect, useState } from 'react';
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import ChatBubble from './ChatBubble';
import SignOut from './SignOut';
import "./Chat.css"

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
            uid: props.uid
        });

        console.log("sent!")
        setMessage("")
    }


useEffect(() => {
    onValue(chatroomRef, (snapshot) => {
        const data = snapshot.val();
        setRoomMessages(roomMessages)
        setRoomMessages(data)
    });
}, [])

  return (
    <div className='chat'>
        <div className='chat--nav'>
            <SignOut setAuthenticated={setAuthenticated}/>
            <button type="submit" onClick={() => {setChooseRoom(true)}}>Join a new room</button>
            <h2>Your other rooms</h2>
        </div>
        <div className='chat--room'>
            <div className='chat--room--container'>
                <div className='chat--room--container--heading'>
                    <h2>{props.room}</h2>
                    {props.room != "main" &&
                        <p>In this room:</p>
                    }

                </div>
                {roomMessages != null &&
                    Object.keys(roomMessages).map((messageData, index) => 
                    <ChatBubble
                        key = {index}
                        uid = {props.uid}
                        senderUid = {roomMessages[messageData].uid}
                        profilePic = {roomMessages[messageData].profilePic} 
                        userName = {roomMessages[messageData].sender}
                        message = {roomMessages[messageData].message}
                    /> 
                    )
                }
            </div>
            <form className="chat--room--send" onSubmit={(e) => { handleAddingMsg(e)}}>
                <input required 
                    type="text" 
                    value={message} 
                    placeholder='type your message' 
                    onChange={(e)=> setMessage(e.target.value)}
                >
                </input>
                <input className='chat--room--send--submit' type="submit" value="Send"></input>
            </form> 
        </div>
    </div>
  )
}

export default Chat