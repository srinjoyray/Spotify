// Spotify.js
import React from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

let REDIRECT_URI;
if (process.env.NODE_ENV === "production") {
    REDIRECT_URI = "https://spotify-qcmc.onrender.com/callback";
} else {
    REDIRECT_URI = "http://localhost:5173/callback";
}

function Spotify() {
    const handleLogin = () => {
        const scope = "user-read-private user-read-email user-top-read";
        const state = "your_random_state";
        const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}&state=${state}`;
        window.location.href = spotifyAuthUrl;
    };

    return (
        <div>
            <h1>Spotify Authentication</h1>
            <button onClick={handleLogin}>Log in with Spotify</button>
        </div>
    );
}

export default Spotify;
