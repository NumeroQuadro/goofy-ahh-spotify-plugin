import { useEffect } from 'react';
import React from 'react';
import { getSpotifyAuthUrl } from '../services/spotifyAuth';

const LoginButton = () => {
    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'loginSpotify') {
                    const url = getSpotifyAuthUrl();
                    window.open(url);
                }
            })
        }
    }, [])
    return (
        <a href={getSpotifyAuthUrl()}>
            <button>Log in with Spotify</button>
        </a>
    );
};

export default LoginButton;