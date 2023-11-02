// Spotify.js
import React from 'react';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/callback'; // Make sure to add this URL to your Spotify Developer Dashboard

function Spotify() {
  const handleLogin = () => {
    const scope = 'user-read-private user-read-email user-top-read';
    const state = 'your_random_state';
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}&state=${state}`;
    window.location.href = spotifyAuthUrl;
  };

  return (
    <div>
      <h1>Spotify Authentication Example</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}

export default Spotify;
