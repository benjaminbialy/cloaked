import './App.css';
import SignIn from './SignIn';
import { useEffect, useState } from "react"
import { auth, database, db } from "./firebaseConfig.js"
import { doc, setDoc } from "firebase/firestore"; 
import Chat from './Chat';
import ChooseRoom from './ChooseRoom';
import { ref, push, set, onValue, get } from "firebase/database";

function App() {
  const [uid, setUid] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [chooseRoom, setChooseRoom] = useState(true)
  const [userAccExists, setUserAccExists] = useState(false)
  const [realRoomName, setRealRoomName] = useState("")
  const [usersRooms, setUsersRooms] = useState("")
  const [chatroomNamesID, setChatroomNamesID] = useState("")

  // used to add the joined room to the user's account.
  const addUserRoomRef = ref(database, 'users/' + uid + "/rooms");

  useEffect(() => {
    auth.onAuthStateChanged((user) => { 
      if(user){
        setUid(user.uid);
        setUserName(user.displayName)
        setProfilePic(user.photoURL)
        return setAuthenticated(true);
      }else{
        return setAuthenticated(false);
      }
    })
  }, []);

  useEffect(() => {
    if(authenticated){
      setDoc(doc(db, "users", uid),{ 
        uid: uid,
        username: userName,
        profilePic: profilePic
        }
      );

      get(addUserRoomRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserAccExists(true)
        } 
        else 
        {
          set(addUserRoomRef, {
            roomName: "main"
          });
          setUserAccExists(true)
        }
      }).catch((error) => {
        console.error(error);
      });

    }  
  }, [uid, authenticated])
  
  var arrRoomNames = []
  var arrUsersRooms = []

  // used to check if a room name exists, and it's password.
  const chatroomsRef = ref(database, 'chatroomNames');

  // used to add to lists of respective refs.
  const newAddUserRoomRef = push(addUserRoomRef);
  const newChatroomsRef = push(chatroomsRef);

  useEffect(() => {
    if(authenticated){
      onValue(addUserRoomRef, (snapshot) => {
          const data = snapshot.val();
          setUsersRooms(data)
      });

      // gets the names of all the rooms on the app
      onValue(chatroomsRef, (snapshot) => {
          const chatroomsData = snapshot.val();

          // an array of objects including a rooms name and password, amongst other data.
          var roomDataArray = Object.values(chatroomsData)

          // saves the id each "room" found under the chatroomNames node
          var roomDataIDArray = Object.keys(chatroomsData)

          setRealRoomName(roomDataArray);
          setChatroomNamesID(roomDataIDArray)
      });
    }

  }, [authenticated])

  var roomDataArray = realRoomName

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

  if( authenticated === false){
    return (
      <div className="app">
        <nav>
          <h1>cloaked</h1>
          <img src={require("./cloak.png")} alt="logo" />
        </nav>
        <div className='app--content'> 
          <h2>The web based chat app for chatting whenever you want, wherever you want.</h2>
          <p>It's as simple as joining a room, inviting your friends and then you're set! All chats are sent in realtime and are simultaneously displayed on all recipients screens.</p>
          <p>Join the main room will all users or make your own and invite some friends!</p>
        </div>
        <SignIn />
      </div>
    );
  }else if(chooseRoom === true){
    return(
      <div>
        <ChooseRoom uid={uid} setAuthenticated={setAuthenticated} userName={userName} setChooseRoom={setChooseRoom} 
        userAccExists={userAccExists} roomDataArray={roomDataArray} arrRoomNames={arrRoomNames} 
        newAddUserRoomRef={newAddUserRoomRef} newChatroomsRef={newChatroomsRef}
        arrUsersRooms={arrUsersRooms} chatroomNamesID={chatroomNamesID} arrUsersRoomsData={arrUsersRoomsData} usersRooms={usersRooms}/>
      </div>
    )
  }
  else if(chooseRoom === chooseRoom){
    return(
        <Chat room={chooseRoom} setChooseRoom={setChooseRoom} uid={uid} profilePic={profilePic} 
              userName={userName} setAuthenticated={setAuthenticated} arrUsersRoomsData={arrUsersRoomsData} />
    );
  }
  else{
    return(
      <div>
        <h2>Sorry, {userName}, an error was encountered.</h2>
        <p>Please click the button to choose a new room.</p>
        <button type="submit" onClick={() => {setChooseRoom(true)}}>Click me</button>
      </div>
    )
  }
}

export default App;
