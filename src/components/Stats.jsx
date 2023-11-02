import React, { useEffect, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const Stats = () => {
    const [userData, setUserData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [totalDuration, setTotalDuration] = useState(0);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        setAccessToken(localStorage.getItem("access_token"));
        fetchUserProfile(localStorage.getItem("access_token"));
        fetchTopItems(localStorage.getItem("access_token"), "tracks");
    }, []);

    const fetchUserProfile = (token) => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios
            .get("https://api.spotify.com/v1/me", { headers })
            .then((response) => {
                console.log(response);
                const { display_name, email, images } = response.data;
                setUserData({ display_name, email, images });
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);
            });
    };

    const formatDuration = (duration_ms) => {
        const minutes = Math.floor(duration_ms / 60000);
        const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const fetchTopItems = (token, type, timeRange, limit, offset) => {
        console.log(token, type);
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const queryParams = new URLSearchParams({
            limit: limit || 10, // Default to 10 if not provided
            offset: offset || 0, // Default to 0 if not provided
        });

        axios
            .get(`https://api.spotify.com/v1/me/top/${type}`, {
                headers,
                params: queryParams,
            })
            .then((response) => {
                console.log(response);
                const { items } = response.data;

                if (type === "tracks") {
                    // Handle top tracks
                    setTopTracks(items);
                    const durationSum = items.reduce(
                        (total, track) => total + track.duration_ms,
                        0
                    );
                    setTotalDuration(durationSum);
                }
            })
            .catch((error) => {
                console.error(`Error fetching top ${type}:`, error);
            });
    };

    return (
        <div>
            <h2>Receipt</h2>
            {userData && 
                <div>
                    <p>Order for {userData.display_name}</p>
                </div>
            }
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>QTY</th>
                        <th>Name</th>
                        <th>AMT</th>
                    </tr>
                </thead>
                <tbody>
                    {topTracks.map((track, index) => (
                        <tr key={index}>
                            <td style={{ width: "20%" }}>{index + 1}</td>
                            <td style={{ width: "60%" }}>
                                {track.name} - {" "}
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </td>
                            <td style={{ width: "20%" }}>{formatDuration(track.duration_ms)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr/>
            <p>ITEM COUNT: {topTracks.length}</p>
            <p>TOTAL: {formatDuration(totalDuration)}</p>
            <hr/>
            
            <p>THANK YOU FOR VISITING!</p>
            <p><FontAwesomeIcon icon={faSpotify} />Spotify</p>
        </div>
    );
};

export default Stats;
