# based on https://github.com/nytimes/nginx-vod-module-docker/

FROM ubuntu:20.04 AS base_image

FROM base_image AS build

ENV TZ=Europe/London
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update
RUN apt -y install curl build-essential libssl-dev zlib1g zlib1g-dev libpcre3 libpcre3-dev ffmpeg libavcodec-dev
RUN mkdir nginx nginx-vod-module

ARG NGINX_VERSION=1.16.1
ARG VOD_MODULE_VERSION=399e1a0ecb5b0007df3a627fa8b03628fc922d5e

RUN curl -sL https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz | tar -C /nginx --strip 1 -xz
RUN curl -sL https://github.com/kaltura/nginx-vod-module/archive/${VOD_MODULE_VERSION}.tar.gz | tar -C /nginx-vod-module --strip 1 -xz

WORKDIR /nginx
RUN ./configure --prefix=/usr/local/nginx \
    --add-module=../nginx-vod-module \
    --with-http_ssl_module \
    --with-file-aio \
    --with-threads \
    --with-cc-opt="-O3"

RUN make
RUN make install
RUN rm -rf /usr/local/nginx/html /usr/local/nginx/conf/*.default

FROM base_image
RUN apt update
RUN apt install -y ca-certificates libssl-dev libpcre3 zlib1g ffmpeg libavcodec-dev
COPY --from=build /usr/local/nginx /usr/local/nginx
COPY ./config/nginx.conf /usr/local/nginx/conf/

ENTRYPOINT ["/usr/local/nginx/sbin/nginx"]
CMD ["-g", "daemon off;"]