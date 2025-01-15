package middleware

import (
	"context"
	"fmt"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2"
	"log"
	"net/http"
	"net/url"
)

var (
	auth  *spotifyauth.Authenticator
	ch    = make(chan *spotify.Client)
	state = "abc123"
)

const redirectURI = "http://localhost:8080/callback"

func createHTTPClientWithProxy(proxyURL string) *http.Client {
	proxy, err := url.Parse(proxyURL)
	if err != nil {
		log.Fatalf("Invalid proxy URL: %v", err)
	}

	transport := &http.Transport{
		Proxy: http.ProxyURL(proxy),
	}

	return &http.Client{
		Transport: transport,
	}
}

func Auth(isProxyClient bool) *spotify.Client {
	config, err := LoadConfig("tokens.json")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	var httpClient *http.Client
	if isProxyClient {
		if config.Proxy != "" {
			httpClient = createHTTPClientWithProxy(config.Proxy)
		} else {
			fmt.Println("Proxy client is required, please edit json field `proxy`")
		}
	} else {
		httpClient = http.DefaultClient
	}

	auth = spotifyauth.New(
		spotifyauth.WithClientID(config.SpotifyID),
		spotifyauth.WithClientSecret(config.SpotifySecret),
		spotifyauth.WithRedirectURL(redirectURI),
		spotifyauth.WithScopes(
			spotifyauth.ScopeUserReadCurrentlyPlaying,
			spotifyauth.ScopeUserReadPlaybackState,
			spotifyauth.ScopeUserModifyPlaybackState,
		),
	)

	ctx := context.WithValue(context.Background(), oauth2.HTTPClient, httpClient)

	http.HandleFunc("/callback", completeAuth(ctx))
	go func() {
		log.Println("Starting HTTP server on :8080")
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			log.Fatal(err)
		}
	}()

	authUrl := auth.AuthURL(state)
	fmt.Println("Please log in to Spotify by visiting the following page in your browser:", authUrl)

	client := <-ch

	return client
}

func completeAuth(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tok, err := auth.Token(ctx, state, r)
		if err != nil {
			http.Error(w, "Couldn't get token", http.StatusForbidden)
			log.Fatal(err)
		}
		if st := r.FormValue("state"); st != state {
			http.NotFound(w, r)
			log.Fatalf("State mismatch: %s != %s\n", st, state)
		}

		client := spotify.New(auth.Client(ctx, tok))
		fmt.Fprintf(w, "Login Completed!")
		ch <- client
	}
}
