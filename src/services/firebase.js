  
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const config = {
    apiKey: "AIzaSyCabWKdsf5aCsBbDgYSwE1WcC14h8zEweM",
    authDomain: "slackerteacher.firebaseapp.com",
    databaseURL: "https://slackerteacher.firebaseio.com",
    projectId: "slackerteacher",
    storageBucket: "slackerteacher.appspot.com",
    messagingSenderId: "243489373613",
    appId: "1:243489373613:web:3f5a2c8617462e29edf524",
    measurementId: "G-1W19F9NRWS"
};

firebase.initializeApp(config);

//export const auth = firebase.auth;
export const db = firebase.database();