import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import logger from './logger'
import sql from 'mssql'

dotenv.config()
const app = express()

const config = {
  server: 'meng-db-server.database.windows.net',
  database: 'meng-db',
  options: {
    encrypt: true, // This is usually required for security reasons
  },
}

if (process.env.NODE_ENV === 'local') {
  Object.assign(config, {
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
    },
  })
} else {
  Object.assign(config, {
    authentication: {
      type: 'azure-active-directory-msi-app-service',
      options: {},
    },
  })
}

app.get('/', (req: Request, res: Response) => {
  logger.log('/', 'customer visits home page')

  res.send('Changed deployment name version 4!')
})

app.get('/users', async (req, res) => {
  let pool: sql.ConnectionPool | undefined
  logger.log('/users', 'step1')

  try {
    pool = await sql.connect(config)
    logger.log('/users', 'step2')
    logger.log('/users', JSON.stringify(pool))
    const result = await pool.query`SELECT Id, Name, Active FROM [Users]`

    res.send(result.recordset)
  } catch (err: any) {
    logger.log('/users', `error message: ${err.message}`)
    res.status(200).send(err.message)
  } finally {
    if (pool) {
      await pool.close()
    }
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
