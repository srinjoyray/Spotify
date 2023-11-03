import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Stats.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const Stats = () => {
    const [userData, setUserData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [totalDuration, setTotalDuration] = useState(0);
    const [accessToken, setAccessToken] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState("medium_term");
    useEffect(() => {
        setAccessToken(localStorage.getItem("access_token"));
        fetchUserProfile(localStorage.getItem("access_token"));
        fetchTopItems(localStorage.getItem("access_token"));
        fetchTopArtists(localStorage.getItem("access_token"));
    }, [selectedTimeRange]);

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

    const fetchTopItems = (token) => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const queryParams = new URLSearchParams({
            time_range: selectedTimeRange,
            limit: 10, 
            offset: 0,
        });

        axios
            .get(`https://api.spotify.com/v1/me/top/tracks`, {
                headers,
                params: queryParams,
            })
            .then((response) => {
                console.log(response);
                const { items } = response.data;

                setTopTracks(items);
                const durationSum = items.reduce(
                    (total, track) => total + track.duration_ms,
                    0
                );
                setTotalDuration(durationSum);
            })
            .catch((error) => {
                console.error(`Error fetching top items:`, error);
            });
    };

    const fetchTopArtists = (token) => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const queryParams = new URLSearchParams({
            time_range: selectedTimeRange,
            limit: 10, 
            offset: 0,
        });

        axios
            .get(`https://api.spotify.com/v1/me/top/artists`, {
                headers,
                params: queryParams,
            })
            .then((response) => {
                console.log(response);
                const { items } = response.data;

                setTopArtists(items);
            })
            .catch((error) => {
                console.error("Error fetching top artists:", error);
            });
    };

    return (
        <div style={{width : 'min(400px, 80vw)'}}>
            <div>
                <label>Select Time Range: </label>
                <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option value="short_term">Last Month</option>
                    <option value="medium_term">Last 6 months</option>
                    <option value="long_term">All time</option>
                </select>
            </div>
            <h2>Receipt</h2>
            {userData && (
                <div>
                    <p>Order for {userData.display_name}</p>
                </div>
            )}
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th className="col-start">QTY</th>
                        <th className="col-med">Name</th>
                        <th className="col-end">AMT</th>
                    </tr>
                </thead>
                <tbody>
                    {topTracks.map((track, index) => (
                        <tr key={index}>
                            <td className="col-start">{index + 1}</td>
                            <td className="col-med">
                                {track.name} -{" "}
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </td>
                            <td className="col-end">
                                {formatDuration(track.duration_ms)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th className="col-start">QTY</th>
                        <th className="col-med">Name</th>
                        <th className="col-end">AMT</th>
                    </tr>
                </thead>
                <tbody>
                    {topArtists.map((artist, index) => (
                        <tr key={index}>
                            <td className="col-start">{index + 1}</td>
                            <td className="col-med">{artist.name}</td>
                            <td className="col-end">{artist.popularity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            {/* <div className="table-total">
                <p>ITEM COUNT: {topTracks.length}</p>
                <p>TOTAL: {formatDuration(totalDuration)}</p>
            </div>
            <hr /> */}

            <p>THANK YOU FOR VISITING!</p>
            <p>
                <FontAwesomeIcon icon={faSpotify} style={{margin : '0 10px'}}/>
                Spotify
            </p>
        </div>
    );
};

export default Stats;
