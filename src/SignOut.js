import { getAuth, signOut } from "firebase/auth";
import React from 'react';

function SignOut({setAuthenticated}) {
    // const { setAuthenticated } = props;

    const signOutWithGoogle = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            setAuthenticated(false);
        }).catch((error) => {
        // An error happened.
        console.log(error)
        });
    }
  return <div>
            <button className= "sign__out--button" onClick={() => { signOutWithGoogle()}}>Sign Out</button>
        </div>;
}

export default SignOut;