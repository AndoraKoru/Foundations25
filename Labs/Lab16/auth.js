
import { auth } from "./firebase.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Successfully created user: ",user)
        return user;
    }
    catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error in Signup with ", error.message);
        throw error;
    }
  }

