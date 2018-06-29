const router = require('express').Router()
const uuidv4 = require('uuid/v4')
const redis = require('redis')
const {Client} = require('../db/models')
const jwt = require('jsonwebtoken')

// -------------------------------------------------------------

const redisClient = redis.createClient({host: 'localhost', port: 6379})

redisClient.on('ready', function() {
  console.log('Redis is ready')
})

redisClient.on('error', function(err) {
  console.log(
    'error event - ' + redisClient.host + ':' + redisClient.port + ' - ' + err
  )
})

// -------------------------------------------------------------

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const clients = await Client.findAll()
    res.json(clients)
  } catch (error) {
    next(error)
  }
})

router.post('/new-project', async (req, res, next) => {
  try {
    const result = await Client.create(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/verify', async (req, res, next) => {
  const {client_id, token} = req.body

  try {
    const result = await Client.findOne({where: {client_id}})
    if (result) {
      const {secret_key} = result
      setTimeout(() => {
        jwt.verify(token, secret_key, (err, decoded) => {
          if (!err) {
            res.send(decoded)
          } else {
            res.status(401).send()
          }
        })
      }, 2000)
    } else res.status(401).send('Invalid token')
  } catch (error) {
    console.log('/client/verify', error.message)
    next(error)
  }
})

router.post('/:client_id', async (req, res, next) => {
  const {client_id} = req.params
  const UUID = uuidv4()

  try {
    const client = await Client.findOne({
      where: {client_id}
    })

    await redisClient.set(UUID, client_id, function(err, reply) {
      err
        ? console.log('Redis error on SET: ', err)
        : console.log('Redis SET: ', `${UUID}: ${client_id}`)
    })

    const {secret_key, public_key, projectName, website} = client
    const result = {
      public_key,
      projectName,
      website,
      UUID
    }
    const token = jwt.sign(result, secret_key)
    res.redirect(`/auth/identify?token=${token}&client_id=${client_id}`)
  } catch (error) {
    next(error)
  }
})
