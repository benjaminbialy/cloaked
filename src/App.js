import './App.css';
import SignIn from './SignIn';
import SignOut from './SignOut';
import { useEffect, useState } from "react"
import { auth, db } from "./firebaseConfig.js"
import { doc, setDoc } from "firebase/firestore"; 
import Chat from './Chat';
import ChooseRoom from './ChooseRoom';


function App() {
  const [uid, setUid] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [chooseRoom, setChooseRoom] = useState(true)


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
    }  
  }, [uid, authenticated])
  

  if( authenticated === false){
    return (
      <div className="App">
        <h1>KeggerChat</h1>
        <SignIn />
      </div>
    );
  }
  // else if(chooseRoom){
  //   return(
  //     <ChooseRoom />
  //   )
  // }
  else{
    return(
      <div>
        <SignOut setAuthenticated={setAuthenticated}/>
        Hello, {userName}
        <Chat uid={uid} profilePic={profilePic} userName={userName}/>
      </div>
    );
  }
}

export default App;
