FROM node:12.22.7-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install
RUN npm run db
RUN npm run build

## this is stage two , where the app actually runs
FROM node:12.22.7-alpine
WORKDIR /app
COPY package.json ./
COPY prisma ./
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
RUN npm install -g pm2
EXPOSE 4000
CMD ["pm2-runtime","dist/server.bundle.js", "--name iTask"]