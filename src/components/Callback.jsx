// Callback.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {CircularProgress} from '@mui/material';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5173/callback"; // Make sure to add this URL to your Spotify Developer Dashboard

function Callback() {
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            // If there's an authorization code in the URL, exchange it for an access token.
            exchangeCodeForToken(code);
        }
    }, []);

    const exchangeCodeForToken = (code) => {
        const data = new URLSearchParams();
        data.append("grant_type", "authorization_code");
        data.append("code", code);
        data.append("redirect_uri", REDIRECT_URI);

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        };

        axios
            .post("https://accounts.spotify.com/api/token", data, { headers })
            .then((response) => {
                const { access_token } = response.data;
                setAccessToken(access_token);
                localStorage.setItem('access_token', access_token);
                navigate("/stats");
            })
            .catch((error) => {
                console.error("Error exchanging code for token:", error);
            });
    };

    return (
        <div>
            <CircularProgress color="inherit" />
        </div>
    );
}

export default Callback;
