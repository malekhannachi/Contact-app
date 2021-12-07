const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')
const bodyParser = require('body-parser')
const assert = require('assert')
const cors = require('cors')
const { url } = require('inspector')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const mongo_url = 'mongodb://localhost:27017'
const dataBase = 'DBContact'
MongoClient.connect(
  mongo_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    assert.equal(err, null, 'DB connection failed')
    const db = client.db(dataBase)
    /**ici seront les services web :get/put post et delete */

    app.get('/contacts', (req, res) => {
      db.collection('contact')
        .find()
        .toArray((err, data) => {
          if (err) res.send('cannot fetch contact')
          else res.send(data)
        })
    })

    app.get('/contact/:id', (req, res) => {
      db.collection('contact').findOne(
        { _id: ObjectID(req.params.id) },
        (err, data) => {
          if (err) res.send('cannot fetch contact')
          else res.send(data)
        },
      )
    })

    app.post('/add_contact', (req, res) => {
      let newcontact = req.body
      db.collection('contact').insertOne(newcontact, (err, data) => {
        if (err) res.send('cannot add new contact')
        else res.send('contact added')
      })
    })

    app.put('/update_contact/:id', (req, res) => {
      db.collection('contact').findOneAndUpdate(
        { _id: ObjectID(req.params.id) },
        { $set: { ...req.body } },
        (err, data) => {
          if (err) {
            res.send('cannot update contact')
            console.log(err)
          } else res.send('contact updated')
        },
      )
    })

    app.delete('/delete_contact/:id', (req, res) => {
      db.collection('contact').findOneAndDelete(
        {
          _id: ObjectID(req.params.id),
        },
        (err, data) => {
          if (err) res.send('cannot delete contact')
          
          else res.send('contact delete')
        },
      )
    })


  },
)

/**ici seront faits les service web */

app.listen(3000, (err) => {
  if (err) {
    console.log('error while running server')
  } else {
    console.log('Server is runnig on prot 3000')
  }
})
 