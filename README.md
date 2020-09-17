Dataflow frontend, designed for users, offering a simple and flexible interface with a component-oriented view of the automation process.
=============================================================

PEYRICHOU Arthur

To learn more about Vue.JS (https://vueschool.io/courses)

> Backend on https://github.com/ArthurPeyrichou/FlowBackend

Prerequisite
=============

You need to add backend hostname in .env.production
You also need to give backend's RSA public key if you activate crypting communication (disable by default).
If you run on docker, you need to give the docker vm ip and backend container port. (Ex: 192.168.99.100:5001)

Configurations
=============

**Dev mode :**

To start the server vue.JS, go to the root folder and type :

- `npm install`
- `npm run serve`

> The server is running on port 4200 by default (http://localhost:4200)

**Prod mode :**

Go to the root folder and type :

- `npm install`
- `npm run build`

Get the folder dist/ in root, and move his contains in production root folder.


Security
=============

For secure communication :

- Change variable "isSecurityActive" to true in src/App.vue 
- Generate RSA keyPair 4096 size, add private key in backend and public key in frontend .env file (see backend instructions for keyPair generation and placement)

Docker
=============

To start the server vue.JS with docker, go to the root folder and type :

- `docker build -t dataflow-frontend .`
- `docker run -it -p 4200:8080 --rm --name dataflow-frontend-1 dataflow-frontend`

License
=============
[MIT](LICENSE)
