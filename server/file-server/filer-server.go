package fileserver

import (
	"fmt"
	"net/http"
)

func StartFileServer() {
	fileServer := http.NewServeMux()
	fileServer.HandleFunc("/", fileServerFunc)

	go func() {
		url := "0.0.0.0:9001"
		dir := "./file-server/static"
		fmt.Sprintln("Server started on: ", url, " and serving in ", dir, " directory")
		http.ListenAndServe(url, http.FileServer(http.Dir(dir)))
	}()
}

func fileServerFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Running File Server")
}
