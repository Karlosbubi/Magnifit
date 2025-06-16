FROM node:20-alpine AS builder

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source code and build
COPY . .
#RUN npm run build

EXPOSE 3000

CMD npm run dev