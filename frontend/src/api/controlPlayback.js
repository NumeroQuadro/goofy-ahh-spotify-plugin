const PLAYBACK = "https://api.spotify.com/v1/me/player"
const PLAYBACK_PLAY = "https://api.spotify.com/v1/me/player/play"
const PLAYBACK_PAUSE = "https://api.spotify.com/v1/me/player/pause"
const PLAYBACK_NEXT = "https://api.spotify.com/v1/me/player/next"
const PLAYBACK_PREV = "https://api.spotify.com/v1/me/player/previous"

export const prevSong = async (accessToken) => {
    try {
        await fetch(`${PLAYBACK_PREV}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
        });

    } catch (error) {
        console.error('cannot skip to prev track due to: ', error);
    }
}

export const nextSong = async (accessToken) => {
    try {
        await fetch(`${PLAYBACK_NEXT}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
        });

    } catch (error) {
        console.error('cannot skip to next track due to: ', error);
    }
}

export const resumePlayback = async (accessToken) => {
    try {
        const response = await fetch(`${PLAYBACK}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
        });

        const playbackState = await response.json();
        if (playbackState && playbackState.is_playing) {
            const response = await fetch(`${PLAYBACK_PAUSE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Failed to pause playback:', response.statusText);
            }
        } else if (playbackState && !playbackState.is_playing) {
            const playResponse = await fetch(`${PLAYBACK_PLAY}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
            });

            if (!playResponse.ok) {
                console.error('Failed to resume playback:', playResponse.statusText);
            }
        }
    }

    catch (error) {
        console.error('Error:', error);
    };
}