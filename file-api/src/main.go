package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

func list(w http.ResponseWriter, req *http.Request) {
	type FileDetail map[string]interface{}
	var fileDetails []FileDetail
	root := "/home/arron/projects/home-vod/nginx-vod/videos"

	path := req.URL.Query()["path"][0]
	path = root + path
	files, err := ioutil.ReadDir(path)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}

	for _, file := range files {
		isDir := file.Mode()&os.ModeSymlink != 0 || file.IsDir()
		tmp := FileDetail{
			"name":     file.Name(),
			"isFolder": strconv.FormatBool(isDir)}
		fmt.Println()
		fileDetails = append(fileDetails, tmp)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fileDetails)
}

func main() {

	http.HandleFunc("/api/list", list)

	fmt.Println("Server started on port 8090...")
	http.ListenAndServe(":8090", nil)
}
