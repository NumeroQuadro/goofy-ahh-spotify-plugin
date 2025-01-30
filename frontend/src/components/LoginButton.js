import React from 'react';
import { getSpotifyAuthUrl } from '../services/spotifyAuth';

const LoginButton = () => {
    return (
        <a href={getSpotifyAuthUrl()}>
            <button>Log in with Spotify</button>
        </a>
    );
};

export default LoginButton;