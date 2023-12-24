import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { DefaultAzureCredential } from '@azure/identity'
import logger from './logger'
import sql from 'mssql'

dotenv.config()
const app = express()

const config = {
  server: 'meng-db-server.database.windows.net',
  database: 'meng-db',
  options: {
    encrypt: true,
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
      options: {
        tokenProvider: async (callback: any) => {
          try {
            const credential = new DefaultAzureCredential()
            const tokenResponse = await credential.getToken(
              'https://database.windows.net/.default'
            )
            callback(null, tokenResponse.token)
          } catch (error) {
            logger.log('tokenProvider error', JSON.stringify(error))
            callback(error, null)
          }
        },
      },
    },
  })
}

app.get('/', (req: Request, res: Response) => {
  logger.log('/', 'customer visits home page')
  res.send('Changed deployment name version 6!')
})

app.get('/users', async (req, res) => {
  let pool: sql.ConnectionPool | undefined

  try {
    pool = await sql.connect(config)
    const result = await pool.query`SELECT Id, Name, Active FROM Users`
    res.send(result.recordset)
  } catch (err: any) {
    res.status(500).send(`Internal Server Error ${JSON.stringify(err)} `)
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
