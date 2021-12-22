FROM node:12.22.7-alpine
RUN apk --no-cache add bash tree
WORKDIR /app
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./
COPY . .
RUN npm install && tree -I node_modules
EXPOSE 4000
CMD ["npm","run","dev:server"]