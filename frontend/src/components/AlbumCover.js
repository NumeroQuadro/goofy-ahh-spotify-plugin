import React, { useEffect, useState } from 'react';
import { retrieveAlbumCover } from '../api/retrieveAlbum';

const AlbumCover = () => {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem('spotify_token');

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const data = await retrieveAlbumCover("4aawyAB9vmqN3uQ7FjRGTy", accessToken);
                if (data.error.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    localStorage.removeItem('spotify_token');
                }

                if (data.error) {
                    setError(data.error.message || 'Failed to fetch album cover.');
                }


                if (data.items) {
                    setTracks(data.items);
                } else {
                    console.error('Unexpected response structure:', data);
                    setError('Unexpected response from the server.');
                }
            } catch (err) {
                setError(err.message)
                console.log('error occurred', err)
            }
        };

        fetchTracks();
    }, [accessToken]);

    return (
        <div>
            <h1>Album Cover</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul>
                    {tracks.map((track, index) => (
                        <li key={index}>
                            {track.track?.name || 'Unknown track'} by {track.track?.artists?.[0]?.name || 'Unknown artist'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AlbumCover;