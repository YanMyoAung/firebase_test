import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, child, push, update, remove } from "firebase/database";// Import only the Firebase services you need
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const usersRef = ref(db, 'users');


function writeUserData(age, gender, name) {
    //let unique_id = push(child(usersRef,'users')).key;
    let new_user_ref = push(usersRef);
    set(new_user_ref, {
        age, gender, name
    });
}

function updateUserData(id, userData) {
    let userref = ref(db, "users/" + id);
    update(userref, userData)
        .then(() => console.log("success"))
        .catch(() => console.error("error"));
}
let newUserData = {
    age: 56,
    gender: "female",
    name: "hellowosrlds"
}

//updateUserData("Nxx_uYQyqddjAqtNjDa", newUserData);


document.getElementById("add").addEventListener("click", () => writeUserData(4, 'male', 'mgmgsoe'));


// Listen for changes to the 'users' node continuously
onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    if (users) {
        // Convert the object of users to an array
        const userList = Object.keys(users).map(userId => ({
            id: userId,
            ...users[userId]
        }));
        console.log(userList);

    } else {
        console.log('No users found.');
    }
});


//remove(usersRef);

