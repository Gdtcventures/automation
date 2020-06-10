FROM node:12.6-stretch-slim AS base

RUN apt-get update && apt-get install

ARG buildid_arg
ENV BUILD_ID=$buildid_arg

RUN mkdir /app
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]