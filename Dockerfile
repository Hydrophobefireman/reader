FROM node:20-alpine3.18

WORKDIR /app

COPY . .

RUN npm i

ENTRYPOINT [  ]

CMD [ "node", "src/index.js" ]