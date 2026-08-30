const API_BASE_URL = '/api'

import {signInWithPopup, signOut} from 'firebase/auth';
import {auth, googleProvider} from '../firebase.js';

export const authService = {

    // Salje kredencijale, dobija JWT token nazad
    // Symfony Security + Lexik JWT bundle ovo rade automatski na /api/login
    async login(email, password) {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed. Check your credentials.');
        }
        // Token čuvamo u localStorage — ostaje i posle refresh-a stranice
        localStorage.setItem('jwt_token', data.token);
        return data.token;

    },

    // Google prijava: Firebase potvrdi identitet, nas backend izda svoj JWT
    async loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();

        const res = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idToken}),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Google prijava nije uspela.');

        localStorage.setItem('jwt_token', data.token);
        await signOut(auth);   // Firebase sesija nam vise ne treba — imamo svoj token
        return data.token;
    },

    // Registruje novog korisnika (ne loguje automatski)
    async register(name, email, password) {
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password}),
        })

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Registration failed.');
        }

        return data;
    },

    // Brise token — korisnik je odjavljen
    async logout() {
        localStorage.removeItem('jwt_token');
    },

    // Dohvati podatke o trenutnom korisniku sa /api/me
    async getMe() {
        const res = await fetch(`${API_BASE_URL}/me`, {
            headers: {'Authorization': `Bearer ${this.getToken()}`}
        });
        if (!res.ok) throw new Error('Could not fetch user info.');
        return res.json();
    },

    // Vraća token ako postoji, null ako ne postoji
    getToken() {
        return localStorage.getItem('jwt_token');
    },

    // Provjeri da li korisnik ima validan token (postoji u localStorage)
    isLoggedIn() {
        return !!localStorage.getItem('jwt_token');
    },
}