#Node 版本
FROM node:18.14.2-alpine
# 使用 apk 命令安装 nodejs 和 yarn，如果使用 npm 启动，就不需要装 yarn
RUN apk add --no-cache --update nodejs=18.12.1 yarn

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN  npm install && npm run tsc
COPY . /build

EXPOSE 80

CMD ["node","build/app.js"]
