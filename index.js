const express = require('express')
const mongoClient = require('mongodb').MongoClient

const app = express()

const uri = 'mongodb+srv://flashitclient:FlashItClient1@flashit.vb8uf3z.mongodb.net/?retryWrites=true&w=majority'

app.get('/post-user', (req,res) => {
  mongoClient.connect(uri, {}, (error, client) => {
    if (error) res.send('Cannot connect to database')
  
    const db = client.db('flashit')
  
    db.collection('user').insertOne({
      username: 'jakkoz',
      password: 'jakkoz123'
    }, (error, result) => {
      if (error) res.send('Cannot insert')
  
      res.send(result)
    })
  })
})

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(9002, () => {
  console.log('Start...')
})