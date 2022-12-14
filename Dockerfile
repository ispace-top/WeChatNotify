#Node 版本
FROM node:16.15.1

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

COPY ./build /build
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm install

EXPOSE 80

CMD ["node","build/app.js"]