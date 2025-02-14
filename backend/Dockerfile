FROM node:22

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install 
RUN npx prisma generate 

COPY . . 

EXPOSE 5000

CMD [ "npm" , "start" ]