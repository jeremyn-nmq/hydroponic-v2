import firebase from 'firebase'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
    apiKey: "AIzaSyD6C_ozA4awyqXxVZz-T1DAbnPdOfdmn6M",
    authDomain: "hydroponic-5e3bd.firebaseapp.com",
    databaseURL: "https://hydroponic-5e3bd.firebaseio.com",
    projectId: "hydroponic-5e3bd",
    storageBucket: "hydroponic-5e3bd.appspot.com",
    messagingSenderId: "380529985168",
    appId: "1:380529985168:web:1a95ecb6d81266877e3a15",
    measurementId: "G-G1FL2M94NY"
};

let fb = firebase.initializeApp(firebaseConfig);

export default fb;
