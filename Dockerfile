FROM node:14.4.0

WORKDIR /usr/src/facerecognition-api

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]