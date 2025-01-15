package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/NumeroQuadro/goofy-ahh-spotify-widget/api/middleware"
)

func main() {
	// Load configuration
	client := middleware.Auth(true)

	user, err := client.CurrentUser(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("You are logged in as:", user.DisplayName)
	cp, err := client.PlayerCurrentlyPlaying(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	name := cp.Item.Name
	albumCoverUrl := cp.Item.Album.Images[0].URL
	fmt.Printf("Current Playing Track is: %s\n", name)
	err = downloadImage(albumCoverUrl, "storage/files/album_cover.jpg")
	if err != nil {
		log.Fatalf("Failed to download image: %v", err)
	}
	fmt.Println("Album cover downloaded successfully as 'album_cover.jpg'")
}

func downloadImage(url string, filepath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to fetch image: status code %d", resp.StatusCode)
	}

	file, err := os.Create(filepath)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return fmt.Errorf("failed to save image to file: %v", err)
	}

	return nil
}
