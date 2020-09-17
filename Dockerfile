FROM node:lts-alpine

# install simple http server
RUN npm install -g http-server

# define folder 'app' as worckspace
WORKDIR /app

# copy 'package.json' and 'package-lock.json'
COPY package*.json ./

# install all project's dependencies
RUN npm install

# copy projects folders and files in defined worckspace
COPY . .

# build app for production
RUN npm run build

# define running port
EXPOSE 4200

CMD [ "http-server", "dist" ]
