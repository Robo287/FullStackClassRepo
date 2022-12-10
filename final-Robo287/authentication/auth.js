import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

/**
 * FIrebase authentication configs
 */
const firebaseConfig = {
    apiKey: "AIzaSyD9Ycy5NvjbOZUPhfkHlb8aFZueSMN4twk",
    authDomain: "imdb-api-auth.firebaseapp.com",
    projectId: "imdb-api-auth",
    storageBucket: "imdb-api-auth.appspot.com",
    messagingSenderId: "26055832150",
    appId: "1:26055832150:web:59a4d5a42c952ce67181f7"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Started working on authentication functions
 * but kept running into script errors
 */
const loginBtn = document.getElementById("login-btn");
loginBtnaddEventListener('click', _ => {
    var email = document.getElementById("email-input").value;
    var password = document.getElementById("password-input").value;

    window.alert(email + '\n' + password);
});