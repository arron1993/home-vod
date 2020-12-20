FROM node:latest as angular_build

RUN npm install -g @angular/cli


RUN mkdir /ng-home-vod
COPY ./package.json /ng-home-vod

WORKDIR /ng-home-vod
RUN npm install
RUN npx ngcc

COPY ./src /ng-home-vod/src
COPY ./angular.json /ng-home-vod
COPY ./tsconfig.app.json /ng-home-vod
COPY ./tsconfig.json /ng-home-vod
RUN ng build --prod

FROM nginx:latest

COPY nginx.conf /etc/nginx
COPY --from=angular_build /ng-home-vod/dist /usr/share/nginx/html

