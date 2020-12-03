package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

func list(w http.ResponseWriter, req *http.Request) {
	type FileDetail map[string]interface{}
	var files []FileDetail
	root := "/home/arron/projects/home-vod/nginx-vod/videos"

	path := req.URL.Query()["path"][0]
	path = root + path

	filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		tmp := FileDetail{
			"name":     info.Name(),
			"isFolder": strconv.FormatBool(info.IsDir())}
		files = append(files, tmp)
		return nil
	})
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(files)
}

func main() {

	http.HandleFunc("/api/list", list)

	fmt.Println("Server started on port 8090...")
	http.ListenAndServe(":8090", nil)
}
