FROM node:10
RUN mkdir /app
RUN chmod a+wr /app
WORKDIR /app
COPY src/package.json /app
RUN npm install
COPY src/ /app
CMD ["npm", "start"]
