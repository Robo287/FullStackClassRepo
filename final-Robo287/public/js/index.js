const signUpBtn = document.getElementById("signup-btn");
const cancelBtn = document.getElementById("cancel-btn");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form")
const checkPWField = document.getElementById("rcpassword-input");
const registerBtn = document.getElementById("register-btn");

/**
 * Event listener to switch displays from the login form
 * to the register form
 */
signUpBtn.addEventListener('click', _ => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

/**
 * Event listener to switch displays from the register form
 * to the login form
 */
cancelBtn.addEventListener('click', _ => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
})

/**
 * Event listener to check both the password fields to see if they are matching
 * and will enable register button when they are matching and disable when they are not
 */
checkPWField.addEventListener('keyup', _ => {
    if(document.getElementById("rpassword-input").value == document.getElementById("rcpassword-input").value) {
        document.getElementById("match-check").style.color = 'green';
        document.getElementById("match-check").innerHTML = "Passwords Match";
        registerBtn.disabled = false;
    } else {
        document.getElementById("match-check").style.color = 'red';
        document.getElementById("match-check").innerHTML = "Passwords Do Not Match";
        registerBtn.disabled = true;
    }
})