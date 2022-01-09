FROM node:14

WORKDIR /srv

COPY package.json .
COPY *.js ./

RUN yarn install

ENTRYPOINT ["npm", "run", "start"]