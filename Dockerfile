FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx vite build
RUN npx esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
