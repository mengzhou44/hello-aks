import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import msRestAzure from 'ms-rest-azure';
import logger from './logger';
import sql from 'mssql';

dotenv.config();
const app = express();

const config = {
  server: 'meng-db-server.database.windows.net',
  database: 'meng-db',
  options: {
    encrypt: true,
  },
};

if (process.env.NODE_ENV === 'local') {
  Object.assign(config, {
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
    },
  });
} else {
  Object.assign(config, {
    authentication: {
      type: 'azure-active-directory-msi-app-service',
      options: {
        tokenProvider: (callback: any) => {
          msRestAzure.loginWithAppServiceMSI({ resource: 'https://database.windows.net/' }, (err: any, credentials: any) => {
            if (err) {
              logger.log('tokenProvider err', JSON.stringify(err));
              callback(err, null);
            } else {
              credentials.getToken((tokenError: any, tokenResponse: any) => {
                if (tokenError) {
                  logger.log('tokenProvider token error', JSON.stringify(tokenError));
                  callback(tokenError, null);
                } else {
                  logger.log('tokenProvider success',  tokenResponse.accessToken);
                  callback(null, tokenResponse.accessToken);
                }
              });
            }
          });
        },
      },
    },
  });
}

app.get('/', (req: Request, res: Response) => {
  logger.log('/', 'customer visits home page');

  res.send('Changed deployment name version 5!');
});

app.get('/users', async (req, res) => {
  let pool: sql.ConnectionPool | undefined;
 
  try {
    pool = await sql.connect(config);  
    const result = await pool.query`SELECT Id, Name, Active FROM Users`;
    res.send(result.recordset);
  } catch (err: any) {
    
    res.status(500).send('Internal Server Error');
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
