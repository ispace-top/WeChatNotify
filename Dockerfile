#Node 版本
FROM node:18-alpine

# 安装 TypeScript
RUN npm install -g typescript

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

COPY ./src/ /src/
COPY ./package.json /package.json
COPY ./tsconfig.json /tsconfig.json

RUN npm install
RUN npm run tsc
COPY . /app
WORKDIR /app
EXPOSE 80

CMD ["node","app.js"]
