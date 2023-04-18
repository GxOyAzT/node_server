const PORT = 9002;
const express = require('express');
const userRoute = require('./routes/user-route');
const deckRoute = require('./routes/deck-route');
const accessControl = require('./services/cors/accessControl');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(accessControl);

app.use(
  cors({
    credentials: true,
    allowedHeaders: 'content-type',
    allowMethods: '*',
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());

app.use(cookieParser());

app.use('/user', userRoute);
app.use('/deck', deckRoute);

app.get('/', (req, res) => {
  res.send('OK');
});

module.exports = app.listen(PORT, () => {
  console.log(`Start on port ${PORT} ...`);
});
