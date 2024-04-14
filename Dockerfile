FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm install cross-env
RUN npm i
CMD ["npm", "run", "dev"]