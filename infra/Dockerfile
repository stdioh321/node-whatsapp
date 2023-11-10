FROM node:16
WORKDIR /app

RUN apt update
RUN apt install -y wget
RUN cd $(mktemp -d) && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt install -y ./google-chrome-stable_current_amd64.deb

# COPY ./ /app
# RUN npm install -f
EXPOSE 3000
CMD npm run start:dev