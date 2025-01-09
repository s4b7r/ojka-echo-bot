FROM node:10
RUN mkdir /app
RUN chmod a+wr /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]
