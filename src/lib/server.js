const express = require('express');
const script = require('./script');

const app = express();

module.exports = {
  start: () => {
    app.use(express.static('public'));

    app.get('/', (req, res) => {
      res.sendFile('public/index.html');
    });

    app.get('/status', (req, res) => {
      const state = script.getMuteState();
      res.json(state);
    });

    app.post('/mute', (req, res) => {
      script.mute();
      res.sendStatus(200);
    });

    app.post('/unmute', (req, res) => {
      script.unmute();
      res.sendStatus(200);
    });

    app.post('/toggle', (req, res) => {
      const state = script.toggle();
      res.json(state);
    });

    app.get('/health', (req, res) => {
      res.sendStatus(200);
    });

    app.listen(3000, () => {
      console.log('App listening on port 3000');
    });
  }
}
