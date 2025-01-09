FROM node:10
RUN mkdir /app
RUN chmod a+wr /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]
LABEL org.opencontainers.image.source=https://github.com/s4b7r/ojka-echo-bot
LABEL org.opencontainers.image.description="A Telegram echo bot"
LABEL org.opencontainers.image.licenses=GPL-3.0-only
