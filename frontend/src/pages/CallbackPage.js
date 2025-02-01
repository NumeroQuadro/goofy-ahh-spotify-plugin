import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpotifyToken } from '../services/spotifyAuth';

const CallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state')
        console.log('state: ', state)

        if (code) {
            getSpotifyToken(code).then((data) => {
                console.log('Access Token:', data.access_token);
                localStorage.setItem('spotify_token', data.access_token);
                navigate('/');
            }).catch((data) => {
                navigate('/')
                console.log('пупупу', data)
            });
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default CallbackPage;