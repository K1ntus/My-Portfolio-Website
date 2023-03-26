FROM node:19.8.1-alpine as base

WORKDIR /usr/app

# Install bin bash
RUN apk update && apk add bash

# USER node
RUN addgroup allusers && adduser -S -G allusers nodeuser

# Copy local files
COPY package*.json .
COPY server.js .
# COPY package-lock.json package-lock.json
# COPY ./webapp/src ./src
# COPY ./webapp/views ./views
# COPY ./webapp/node_modules ./views/node_modules
ENV HOST 0.0.0.0
EXPOSE 3000
ENV npm_config_cache /tmp/npm
# Do at the end only

FROM base as production
ENV NODE_ENV=production
RUN npm ci
# USER nodeuser
# CMD ["npm", "start"]
CMD ["node", "bin/www"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon
RUN npm install
# USER nodeuser
# ENTRYPOINT ["tail", "-f", "/dev/null"]
# CMD ["npm", "run", "dev"]  
CMD ["nodemon", "bin/www"]