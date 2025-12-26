import { signup } from "./auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const messageDiv = document.getElementById("message");

const showMessage = (msg, isError = false) => {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError? "red" : "green";
}

signupBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Stops page from reloading whenever the button is clicked

    const email = emailInput.value; 
    const password = passwordInput.value;

    //console.log(email, password);
    try {
        const user = await signup(email, password);
        showMessage("Sucessfully signed up user " + user.email);
    }
    catch (error) {
        showMessage("Error with signup " + error.message, true)
        //console.log(error.message);
    }

    // console.log(user);
})