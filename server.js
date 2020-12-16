var express = require('express');
var app = express();
// var http = require('http').createServer(app);
var WebSocket = require('ws');
var wss;

// const cors = require('cors');


let votes = new Map();

// app.use(cors());

// app.get('/vote/:userName/:voteFib', function (req, res, next) {
//   const userName = req.params.userName;
//   const voteFib = req.params.voteFib;
//   votes.set(userName, voteFib);
// 	const response = {
// 		votes: Array.from(votes).map(([userName, voteFib]) => ({userName, voteFib}))
// 	};
// 	res.json(response);
// });

// app.get('/clear', function (req, res, next) {
// 	const response = {
// 		votes: []
//   };

//   broadcast();

// 	res.json(response);
// });

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

// wss.on('connection', function connection(ws) {
//   console.log('TERRY ws server connection');
//   ws.on('message', function incoming(data) {
//     console.log('TERRY ws server message', data);
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         console.log('TERRY ws server client', client, message);
//         client.send(message);
//       }
//     });
//   });
// });

// http.listen(5000, function(){
// 	console.log('listening on *:5000');
// });
