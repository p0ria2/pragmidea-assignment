FROM node:20.16.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD ["npm", "start"]