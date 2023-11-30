FROM node:21-alpine3.17

WORKDIR /app

COPY . .

RUN npm i

ENTRYPOINT [  ]

CMD [ "node", "index.js" ]