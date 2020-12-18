import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
	apiKey: "AIzaSyD-uk3DpKYY3EwKfVm7G-uAC7UePLAa50g",
	authDomain: "meuapp-16073.firebaseapp.com",
	projectId: "meuapp-16073",
	storageBucket: "meuapp-16073.appspot.com",
	messagingSenderId: "780684854173",
	appId: "1:780684854173:web:9446202dcb8746b4e3a574",
	measurementId: "G-72GMVVK0T4"
};

if (!firebase.apps.length){
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
