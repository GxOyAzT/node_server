const express = require('express')
const userRoute = require('./routes/user-route')
const folderRoute = require('./routes/folder-route')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json());

app.use('/user', userRoute)
app.use('/folder', folderRoute)

app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(9002, () => {
  console.log('Start...')
})