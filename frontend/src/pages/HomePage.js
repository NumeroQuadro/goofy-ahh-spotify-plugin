import React, { useState, useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import AlbumCover from '../components/AlbumCover';
import ResumePlayerButton from '../components/ResumePlayerButton';
import PrevSongButton from '../components/PrevSongButton';
import NextSongButton from '../components/NextSongButton';


const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('spotify_token');
        if (accessToken && accessToken.trim() !== '') {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div>
            <h1>Welcome to My Spotify App</h1>
            <LoginButton />
            <PrevSongButton />
            <ResumePlayerButton />
            <NextSongButton />
            {isLoggedIn ? (
                <AlbumCover />
            ) : (
                <p>Please log in to Spotify to view your album cover.</p>
            )}
        </div>
    );
};

export default HomePage;
