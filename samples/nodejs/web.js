const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const ArenaSimulator = require('./arena');

app.use(bodyParser.json());

app.get('/', function (req, res) {
    console.log('test get');
    const moves = ['F', 'T', 'L', 'R'];
    res.send(moves[Math.floor(Math.random() * moves.length)]);   
});

app.post('/', function (req, res) {
    console.log('test post');
  console.log(req.body);
  
  try {
    const arenaSimulator = new ArenaSimulator(req.body);
    const nextMove = arenaSimulator.calculateNextMove();

    res.send(nextMove);      
  } catch (error) {
    console.log(error);
    const moves = ['F', 'T', 'L', 'R'];
    res.send(moves[Math.floor(Math.random() * moves.length)]);   
  }
});

app.listen(process.env.PORT || 8080);
