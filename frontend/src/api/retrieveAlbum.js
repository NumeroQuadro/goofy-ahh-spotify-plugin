const GET_ALBUM_ENDPOINT = "https://api.spotify.com/v1/albums/"

export const retrieveAlbumCover = async (albumId, accessToken) => {
    try {
        const response = await fetch(`${GET_ALBUM_ENDPOINT}${albumId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        console.log('retrieveAlbumCover response:', data);

        return data
    } catch (error) {
        console.error('Error:', error);
    };
}