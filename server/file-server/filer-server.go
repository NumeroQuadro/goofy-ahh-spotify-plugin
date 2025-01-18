package fileserver

import (
	"fmt"
	"log"
	"net/http"
)

func StartFileServer() {
	log.Println("Server started on: http://localhost:9000")
	main_server := http.NewServeMux()

	fileServer := http.NewServeMux()
	fileServer.HandleFunc("/", fileServerFunc)

	go func() {
		log.Println("Server started on: http://localhost:9001")
		http.ListenAndServe("localhost:9001", http.FileServer(http.Dir("./file-server/static")))
	}()

	http.ListenAndServe("localhost:9000", main_server)
}

func fileServerFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Running File Server")
}
