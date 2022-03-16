import './App.css';
import SignIn from './SignIn';
import { useEffect, useState } from "react"
import { auth, database, db } from "./firebaseConfig.js"
import { doc, setDoc } from "firebase/firestore"; 
import Chat from './Chat';
import ChooseRoom from './ChooseRoom';
import { get, ref, set } from "firebase/database";



function App() {
  const [uid, setUid] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [chooseRoom, setChooseRoom] = useState(true)
  const [userAccExists, setUserAccExists] = useState(false)

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
  

  if( authenticated === false){
    return (
      <div className="App">
        <h1>KeggerChat</h1>
        <SignIn />
      </div>
    );
  }else if(chooseRoom === true){
    return(
      <div>
        <ChooseRoom uid={uid} setAuthenticated={setAuthenticated} userName={userName} setChooseRoom={setChooseRoom} userAccExists={userAccExists}/>
      </div>
    )
  }
  else if(chooseRoom === chooseRoom){
    return(
      <div className="room">
        <Chat room={chooseRoom} setChooseRoom={setChooseRoom} uid={uid} profilePic={profilePic} 
              userName={userName} setAuthenticated={setAuthenticated}/>
      </div>
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
