import React, { useEffect } from 'react';
import { nextSong } from '../api/controlPlayback';

const NextSongButton = () => {
    const accessToken = localStorage.getItem('spotify_token');

    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'nextSong') {
                    const token = localStorage.getItem('spotify_token');
                    if (token) {
                        try {
                            await nextSong(token);
                            console.log('Skipped to next song via service worker message');
                        } catch (error) {
                            console.error('Error resuming playback:', error);
                        }
                    } else {
                        console.error('Spotify token not found');
                    }
                }
            });
        }
    }, []);

    const handleClick = () => {
        nextSong(accessToken);
    };

    return (
        <button onClick={handleClick}>
            Next
        </button>);
}

export default NextSongButton;