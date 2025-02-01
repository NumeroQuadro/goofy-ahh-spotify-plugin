import React, { useEffect } from 'react';
import { resumePlayback } from '../api/controlPlayback';

const ResumePlayerButton = () => {
    const accessToken = localStorage.getItem('spotify_token');

    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'resumePlayback') {
                    const token = localStorage.getItem('spotify_token');
                    if (token) {
                        try {
                            await resumePlayback(token);
                            console.log('Playback resumed via service worker message');
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
        resumePlayback(accessToken);
    };

    return (
        <button onClick={handleClick}>
            Resume Playback
        </button>);
}

export default ResumePlayerButton;