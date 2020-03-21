
const clientId = '6acd4fb44b3443c190e390753512049d';
const redirectUri = 'http://localhost:3000/';
let accessToken;


const Spotify = {
    async getAccessToken () {
        if (accessToken) {
            return accessToken;
        }

        //check for access token match
        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);
            // This clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async search (term) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers });
        const tracksJson = await response.json();
        const tracksList = tracksJson.tracks;

        if (!tracksList) {
            return [];
        }

        return tracksList.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));

    },

    async savePlaylist (name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        // Spotify user
        const user = await fetch('https://api.spotify.com/v1/me', { headers });
        const userObj = await user.json();
        const { id: userId } = userObj;

        // User playlists
        const playlists = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name })
        });
        const playlistObj = await playlists.json();
        const { id: playlistId } = playlistObj;

        // Playlist tracks
        const tracks = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        
        return tracks;
    }
};

export default Spotify;
