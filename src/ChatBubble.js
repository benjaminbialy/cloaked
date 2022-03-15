import React from 'react'
import "./ChatBubble.css"

function ChatBubble(props) {

  var time = new Date(props.time);

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    let daily = ""
    let minutes = padTo2Digits(date.getMinutes())
    let hours = date.getHours()
    let day = ""
    let month = ""
    let year = ""

    if (hours > 12) {
      daily = (hours - 12) + ":" + minutes + " pm"
    }
    else if (hours < 12) {
      daily = hours + ":" + minutes + " am"
    }
    else{
      daily = hours + ":" + minutes + " pm"
    }
    
    day = padTo2Digits(date.getDate())
    month = padTo2Digits(date.getMonth() + 1)
    year = date.getFullYear()

    return daily + " " + day + "-" + month + "-" + year
  }
    
  return (
    <div className='chat__bubble'
      style={{
        alignSelf: props.senderUid === props.uid ? 'flex-end' : 'flex-start'
      }}
    >
      <div className='chat__bubble--text'
            style={{
              backgroundColor: props.senderUid === props.uid ? 'white' : '#EDEFF1',
          }}
      >
        <div className='chat__bubble--text--send__info'>
          <div>{props.senderUid === props.uid ? "You" : props.userName}</div>
          {props.userName != "Admin" &&
            <div className='chat__bubble--text--send__info--timestamp'>{formatDate(time)}</div>
          }
        </div>
        <div>{props.message}</div>

      </div>
      {props.userName != "Admin" &&
        <img
          className='chat__bubble--profile__pic'
          src={props.profilePic}
          alt="profile pic"
        />
      }
    </div>
  )
}

export default ChatBubble