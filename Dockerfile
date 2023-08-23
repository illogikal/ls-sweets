FROM node:20

WORKDIR /

COPY ./app/package*.json ./
COPY ./app/yarn.lock ./

RUN yarn install 

COPY ./app .

EXPOSE 3000

CMD ["yarn", "run", "test"]
