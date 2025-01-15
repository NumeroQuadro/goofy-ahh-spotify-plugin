package middleware

import (
	"encoding/json"
	"os"
)

type Config struct {
	SpotifyID     string `json:"spotify_id"`
	SpotifySecret string `json:"spotify_secret"`
	Proxy         string `json:"proxy"` // Proxy configuration
}

func LoadConfig(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, err
	}
	return &config, nil
}
