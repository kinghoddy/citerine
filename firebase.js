import * as firebase from "firebase/app";
import "firebase/analytics";

// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyCdecYpo32aIFrmpRS89S1h0gJA7jsYOBI",
    authDomain: "citrine-4e2ce.firebaseapp.com",
    databaseURL: "https://citrine-4e2ce.firebaseio.com",
    projectId: "citrine-4e2ce",
    storageBucket: "citrine-4e2ce.appspot.com",
    messagingSenderId: "588510352807",
    appId: "1:588510352807:web:21024c18afdc5e59b15282",
    measurementId: "G-XW3LN5XBXW"
};
// Initialize Firebase

try {
    firebase.initializeApp(config)
    console.log('success');

} catch (error) {
    console.log('failed');

}
export default firebase

