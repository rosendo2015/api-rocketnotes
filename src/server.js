/* eslint-disable @typescript-eslint/no-unused-vars */
require('express-async-errors')
require('dotenv/config')
const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const uploadConfig = require('./config/upload')
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)
migrationsRun()
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }
  console.log(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server ERROR',
  })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`PORT server is running on ${PORT}`))
