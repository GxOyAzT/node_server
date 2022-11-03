const express = require('express')

const app = express()

app.get('/', (req,res) => {
  console.log('hello')
})

app.listen(5000, () => {
  console.log('Start...')
})