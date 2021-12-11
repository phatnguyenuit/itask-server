FROM node:12.22.7-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:12.22.7-alpine
RUN adduser -D fastnguyen
USER fastnguyen
WORKDIR /app
COPY package.json ./
COPY prisma ./
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
# EXPOSE 4000
CMD ["node","dist/server.bundle.js"]

# Push to heroku
# heroku container:push web -a itask-api

# Release
# heroku container:release web -a itask-api