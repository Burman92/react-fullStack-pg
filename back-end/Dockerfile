FROM node:18.7.0
WORKDIR /app
COPY package*.json ./
COPY migration.js ./
COPY seed.js ./

RUN npm install -g nodemon
RUN npm install -g express
RUN npm install


COPY . . 
EXPOSE 8100
CMD [ "nodemon", "routes.js"]