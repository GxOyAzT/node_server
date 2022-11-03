const express = require('express')
const userRoute = require('./routes/user-route')

const app = express()

app.use(express.json());

app.use('/user', userRoute)

app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(9002, () => {
  console.log('Start...')
})