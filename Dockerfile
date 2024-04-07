#Node 版本
# FROM node:16.15.1
# FROM alpine:latest
FROM node:18.14.2-alpine

# 使用 apk 命令安装 nodejs 和 yarn，如果使用 npm 启动，就不需要装 yarn
# RUN apk add --no-cache --update nodejs=18.14.2-alpine yarn

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

COPY ./build ./Dockerfile
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN npm install -g typescript && npm install && npm run tsc

EXPOSE 80

CMD ["node","build/app.js"]
