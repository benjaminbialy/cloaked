import React from 'react'
import "./ChatBubble.css"

function ChatBubble(props) {
  return (
    <div className='chat__bubble'
        style={{
            backgroundColor: props.senderUid === props.uid ? 'white' : '#EDEFF1',
            alignSelf: props.senderUid === props.uid ? 'flex-end' : 'flex-start'
      }}
    >
        <div>{props.senderUid === props.uid ? "You" : props.userName}</div>
        <div>{props.message}</div>
    </div>
  )
}

export default ChatBubble