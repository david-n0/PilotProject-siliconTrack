import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

// Ove vrednosti NISU tajne - Firebase web config je javan po dizajnu.
// Pristup se kontrolise kroz Authorized domains + verifikaciju tokena na backendu.
const firebaseConfig = {
    apiKey: "AIzaSyAEbe8bA4l3JZmcq3col0sHKT8hDDXCt1c",
    authDomain: "silicon-track.firebaseapp.com",
    projectId: "silicon-track",
    appId: "1:111112830450:web:9a8538c7ae56e33a37bf6b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();