FROM node:12.22.7-alpine
RUN apk --no-cache add tree
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./
COPY . .
RUN npm install && tree -I node_modules
EXPOSE 4000
CMD ["npm","run","dev:server"]