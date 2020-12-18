# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang

# Copy the local package files to the container's workspace.
ADD . /go-file-api

# Build the outyet command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
WORKDIR /go-file-api
RUN go build -o /go-file-api/build

# Run the outyet command by default when the container starts.
ENTRYPOINT /go-file-api/build/go-file-api

# Document that the service listens on port 8080.
EXPOSE 8090