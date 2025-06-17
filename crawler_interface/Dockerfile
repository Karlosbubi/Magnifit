FROM node:20 AS builder

COPY . .

#RUN npm install -g pnpm
RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm run start