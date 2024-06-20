FROM node:10-alpine
WORKDIR dist/CareOnLine
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
CMD [ "node", "app.js" ]
test