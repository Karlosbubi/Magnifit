# ---- Build Stage ----
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code and build
COPY . .
RUN pnpm build

EXPOSE 3000

CMD pnpm start