FROM node:23-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install build dependencies and npm packages
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3000