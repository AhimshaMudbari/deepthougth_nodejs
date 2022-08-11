const express = require('express');
const app = express();
const event = require('./routes/event');
require('dotenv').config();
const { run } = require('./database/db');

app.use(express.json());
app.use('/api/v3/app', event);

const port = process.env.PORT || 3000;
run().then(() => {
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
    console.log('db connected');
  });
});
