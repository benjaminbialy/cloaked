import React from 'react'
import { useEffect, useState } from 'react';
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import ChatBubble from './ChatBubble';
import "./Chat.css"

function Chat(props) {
    const [message, setMessage] = useState("");
    const [roomMessages, setRoomMessages] = useState([])
    const [change, setChange] = useState(0)
    const [retrivedMessages, setRetrivedMessages] = useState("")

    const db = getDatabase();
    const postListRef = ref(db, 'chatrooms/' + "main" + "/messages");


    const handleAddTask = (e) => {
        e.preventDefault();
        const newPostRef = push(postListRef);

        set(newPostRef, {
            message: message,
            sender: props.userName,
            profile__pic: props.profilePic,
            uid: props.uid
        });

        console.log("sent!")
        setMessage("")
    }


useEffect(() => {
    onValue(postListRef, (snapshot) => {
        const data = snapshot.val();
        setRoomMessages(roomMessages)

        console.log("messages = " + JSON.stringify(data))
        setRoomMessages(data)

        console.log(data)

        setChange(change+1)
        console.log("chwnge = " + change)

    });
}, [])

console.log("fhshs " + ((Object.keys(roomMessages).map(key => roomMessages[key]))[0]))

  return (
    <div className='chat'>
        <div>
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
        <form className="send--form" onSubmit={(e) => { handleAddTask(e)}}>
            <input required 
                type="text" 
                value={message} 
                placeholder='type your message' 
                onChange={(e)=> setMessage(e.target.value)}
                className='add__task--box'
            >
            </input>
            <input className='add__task--submit' type="submit" value="Add"></input>
        </form> 
    </div>
  )
}

export default Chat