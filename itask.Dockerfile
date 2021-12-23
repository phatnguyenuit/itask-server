FROM node:12.22.7-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./src ./
COPY . .
RUN npm run build

## this is stage two , where the app actually runs
FROM node:12.22.7-alpine
RUN apk --no-cache add bash tree
WORKDIR /app
COPY --from=0 /app/dist ./dist
COPY package.json ./
COPY prisma ./prisma
COPY ./scripts/wait-for-it.sh ./wait-for-it.sh
# Make wait-for-it.sh executable
RUN chmod +x ./wait-for-it.sh
RUN npm install --only=production
RUN tree -I node_modules
EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]