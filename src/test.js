import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, update, remove, query } from "firebase/database";// Import only the Firebase services you need
import { firebaseConfig } from "./config.js";
import { ref as storageRef, getStorage, getStream, uploadBytes, getDownloadURL } from "firebase/storage";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const usersRef = ref(db, 'users/');

window.addEventListener('load', pageLoad);
document.getElementById('saveUser').addEventListener('click', createUser);


function pageLoad() {
    document.getElementById('profile').value = "";
    document.getElementById('upd_id').value = " ";
    document.getElementById('updateUser').addEventListener("click", update_user);
    const usersRefOrderedByAge = query(usersRef);
    console.log(usersRefOrderedByAge);
    onValue(usersRefOrderedByAge, (snapshot) => {
        const users = snapshot.val();
        console.log(users);
        if (users) {
            // Convert the object of users to an array
            const userList = Object.keys(users).map(userId => ({
                id: userId,
                ...users[userId]
            }));

            loadUsersTable(userList);

        } else {
            console.log('No users found.');
        }
    });
}

function createUser() {
    const name = document.getElementById('fname').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const country = document.getElementById('country').value;
    const profile = document.getElementById("profile");
    let profile_url = "default";
    if (profile.files.length !== 0) {
        const userStorageRef = storageRef(storage, 'users/' + profile.value);
        uploadBytes(userStorageRef, profile.files[0])
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    profile_url = url;
                    const data = {
                        name,
                        age,
                        gender,
                        country,
                        profile_url
                    };
                    const newUserRef = push(usersRef);

                    // Set the data under the newly generated key
                    set(newUserRef, data)
                        .then(() => {
                            console.log("User added successfully");
                        })
                        .catch((error) => {
                            console.error("Error adding user: ", error);
                        });
                });
            })
            .catch(() => console.error("error upload profile"));
    }

}

function update_user_bind(id) {
    let usrRef = ref(db, "users/" + id);
    onValue(usrRef, (snapShot) => {
        const data = snapShot.val();
        document.getElementById('upd_name').value = data.name;
        document.getElementById('upd_age').value = data.age;
        document.getElementById('upd_gender').value = data.gender;
        document.getElementById('upd_country').value = data.country;
        document.getElementById('upd_id').value = id;
    });
    document.getElementById("myModal").style.display = "block";
}

function update_user() {
    let id = document.getElementById('upd_id').value;
    if (id) {
        const updateRef = ref(db, "users/" + id);
        let name = document.getElementById('upd_name').value;
        let age = document.getElementById('upd_age').value;
        let gender = document.getElementById('upd_gender').value;
        let country = document.getElementById('upd_country').value;
        const data = { name, age, gender, country };
        update(updateRef, data)
            .then(() => console.log("success update user"))
            .catch(() => console.error("error update user"));

    }
    document.getElementById("myModal").style.display = "none";
}

function loadUsersTable(userList) {
    let table = document.getElementById('customers');
    table.innerHTML = "";
    table.innerHTML = template_users_th();

    if (userList !== null) {

        for (const data of userList) {
            table.innerHTML += template_users(data.name, data.gender, data.age, data.country, data.id); // pass the user id
        }
        attachEventListeners(); // attach event listeners after creating all delete buttons
    }
}

function deleteUser(id) {
    let userRef = ref(db, "users/" + id);
    remove(userRef).then(() => console.log("success delete user"))
        .catch(() => console.error("error delete user"));
}

function attachEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.dataset.userId; // retrieve user id from data attribute
            deleteUser(userId);
        });
    });

    const updateButtons = document.querySelectorAll('.update-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.dataset.userId; // retrieve user id from data attribute
            update_user_bind(userId);
        });
    });
}

function template_users(name, gender, age, country, id) {
    return `<tr>
    <td>${name}</td>
    <td>${gender}</td>
    <td>${age}</td>
    <td>${country}</td>
    <td><button class="delete-btn" data-user-id="${id}">Delete</button></td>
    <td><button class="update-btn" data-user-id="${id}" >Update</button></td>
  </tr>`;
}

function template_users_th() {
    return `<tr>
    <th>Name</th>
    <th>Gender</th>
    <th>Age</th>
    <th>Country</th>
    <th>Delete</th>
    <th>Update</th>
  </tr>`;
}

document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("myModal").style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
};
