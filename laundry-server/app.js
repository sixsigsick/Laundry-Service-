const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const orderRoutes = require('./routes/orderRoutes')
app.use('/orders', orderRoutes)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})