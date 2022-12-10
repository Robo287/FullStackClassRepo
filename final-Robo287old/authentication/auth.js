firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // user is signed in
        document.getElementById("login-div").style.display = "none";
        document.getElementById("signup-div").style.display = "none";
        document.getElementById("login-message").style.display = "block";
    } else {
        // user is not signed in
        document.getElementById("login-div").style.display = "block";
        document.getElementById("signup-div").style.display = "none";
        document.getElementById("login-message").style.display = "none";
    }
});

function login() {
    var userEmail = document.getElementById("login-email").value;
    var userPass = document.getElementById("login-password").value;
}

function showRegister() {
    document.getElementById("login-div").style.display = "none";
    document.getElementById("signup-div").style.display = "block";
    document.getElementById("login-message").style.display = "none";
}

function register() {
    document.getElementById("login-div").style.display = "block";
    document.getElementById("signup-div").style.display = "none";
    document.getElementById("login-message").style.display = "none";
}