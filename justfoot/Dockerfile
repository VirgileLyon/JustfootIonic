#######################################
## FETCH
#######################################
FROM node:12-alpine AS deps

RUN apk add --no-cache git
COPY package.json /tmp/package.json
RUN cd /tmp && npm i

#######################################
## SERVE
#######################################
FROM node:12-alpine AS serve

RUN mkdir -p /usr/src/app
COPY --from=deps /tmp/node_modules/ /usr/src/app/node_modules/

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json ./

CMD npm run serve

#######################################
## BUILD
#######################################
FROM node:12-alpine AS main

RUN mkdir -p /usr/src/app
COPY --from=deps /tmp/node_modules/ /usr/src/app/node_modules/

WORKDIR /usr/src/app

COPY tsconfig.json ./
COPY package.json ./
ADD src/ ./src

RUN npm run build 
CMD npm run launch