FROM node:latest as angular_build

ADD . /ng-home-vod

WORKDIR /ng-home-vod

RUN npm install -g @angular/cli
RUN npm install

RUN ng build --prod


FROM nginx:latest

RUN mkdir /usr/share/html/ng-home-vod
COPY --from=angular_build /ng-home-vod/dist /usr/share/html/ng-home-vod

