// Import and configure Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get DOM elements
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userDetails = document.getElementById('user-details');
const userEmail = document.getElementById('user-email');
const signInContainer = document.getElementById('sign-in-container');

// Sign up
signUpBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User signed up:', user);
    })
    .catch((error) => {
      console.error('Error signing up:', error);
    });
});

// Sign in
signInBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User signed in:', user);
    })
    .catch((error) => {
      console.error('Error signing in:', error);
    });
});

// Sign out
signOutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('User signed out');
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userEmail.textContent = `Signed in as: ${user.email}`;
    userDetails.style.display = 'block';
    signInContainer.style.display = 'none';
  } else {
    // User is signed out
    userDetails.style.display = 'none';
    signInContainer.style.display = 'block';
  }
});
