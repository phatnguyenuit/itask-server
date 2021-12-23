FROM node:12.22.7-alpine
RUN apk --no-cache add bash tree
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./
COPY . .
# Make wait-for-it.sh executable
RUN chmod +x ./scripts/wait-for-it.sh
RUN npm install && tree -I node_modules
EXPOSE 4000
CMD ["npm","run","dev:server"]