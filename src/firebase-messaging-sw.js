importScripts('https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.6/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyAtXvaqTH12v43Ttb_SgX9J3uszfz7jfGc",
    authDomain: "desiwallet-4b82a.firebaseapp.com",
    projectId: "desiwallet-4b82a",
    storageBucket: "desiwallet-4b82a.appspot.com",
    messagingSenderId: "989741442678",
    appId: "1:989741442678:web:f05a879ad95467f26fa157"
});
const messaging = firebase.messaging();