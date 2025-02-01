import React, { useEffect } from 'react';
import { nextSong, prevSong } from '../api/controlPlayback';

const PrevSongButton = () => {
    const accessToken = localStorage.getItem('spotify_token');

    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'prevSong') {
                    const token = localStorage.getItem('spotify_token');
                    if (token) {
                        try {
                            await nextSong(token);
                            console.log('Skipped to prev song via service worker message');
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
        prevSong(accessToken);
    };

    return (
        <button onClick={handleClick}>
            Prev
        </button>);
}

export default PrevSongButton;