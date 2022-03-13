import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig.js"

function SignIn(props) {
  const {setAuthenticated} = props;
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        setAuthenticated(true)

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return <div className='signin'>
            <div className='signin--prompt'>
                <h2>To proceed to chat, sign in below</h2>
                <button className='black--button' onClick={() => { signInWithGoogle()}}>Sign In With Google</button>
            </div>
        </div>;
}

export default SignIn;