import React from 'react'
import "./ChatBubble.css"

function ChatBubble(props) {
  return (
    <div className='chat__bubble'
        style={{
            backgroundColor: props.senderUid === props.uid ? 'lightblue' : 'grey'
      }}
    >
        <img src={props.profilePic}/>
        <div>{props.userName}</div>
        <div>{props.message}</div>
    </div>
  )
}

export default ChatBubble