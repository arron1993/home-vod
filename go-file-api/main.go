package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

func getRootDir() string {
	var root string
	if os.Getenv("ENV") == "dev" {
		root = "/home/arron/projects/home-vod/nginx-vod/videos"
	} else {
		root = "/opt/static/videos"
	}
	return root
}

func getListeningPort() string {
	var port string
	if os.Getenv("ENV") == "dev" {
		port = "8090"
	} else {
		port = "80"
	}
	return port
}

func files(w http.ResponseWriter, req *http.Request) {
	type FileDetail map[string]interface{}
	var fileDetails []FileDetail
	root := getRootDir()

	path := req.URL.Query()["path"][0]
	path = root + path
	files, err := ioutil.ReadDir(path)
	fmt.Println("Read Path", path)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}

	for _, file := range files {
		isDir := file.Mode()&os.ModeSymlink != 0 || file.IsDir()
		tmp := FileDetail{
			"name":     file.Name(),
			"isFolder": strconv.FormatBool(isDir)}

		fileDetails = append(fileDetails, tmp)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fileDetails)
}

func main() {

	http.HandleFunc("/api/files", files)

	fmt.Println("Server started on port", getListeningPort())
	fmt.Println("Looking for files in ", getRootDir())

	listeningPort := fmt.Sprintf(":%s", getListeningPort())

	http.ListenAndServe(listeningPort, nil)
}
