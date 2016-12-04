FROM mhart/alpine-node:6
EXPOSE 3022
CMD cd /home && npm i && npm start
