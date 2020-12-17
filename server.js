var express = require('express');
var app = express();
var WebSocket = require('ws');
var wss;

// const cors = require('cors');


let votes = new Map();

const PORT = process.env.PORT || 5000;
wss = new WebSocket.Server({port: PORT});

wss.on('connection', ws => {

  broadcast();

  ws.on('message', message => {

    console.log(new Date(), message);
    if (!message || message === '{}') {
      votes.clear();
    } else {
      const msg = JSON.parse(message);
      const userName = msg.userName;
      const voteFib = msg.voteFib;

      votes.set(userName, voteFib);
    }

    broadcast();

  });
  ws.on('error', error => {
    console.log('ws error', error);
  });
  ws.on('close', ws=> {
    // console.log('ws close');
  })
});

function broadcast() {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {

      const response = {
        votes: Array.from(votes).map(([userName, voteFib]) => ({userName, voteFib}))
      };
      client.send(JSON.stringify(response));
    }
  });
}