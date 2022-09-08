# pull official base image
FROM node:14.17.6-alpine AS app-core

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# add app
COPY . ./

# start app
FROM app-core
EXPOSE 30443 443
CMD ["yarn", "run", "start"]
