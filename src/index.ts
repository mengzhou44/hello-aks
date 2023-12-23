import express, { Request, Response } from 'express'

const appInsights = require('applicationinsights')

const app = express()
appInsights.setup('6594dca3-9bf1-4f07-8610-a4c1fbdb9b34').start()
const client = appInsights.defaultClient

app.get('/', (req: Request, res: Response) => {
  client.trackEvent({
    name: '/',
    properties: { customProperty: 'customer visits home page' },
  })

  res.send('Changed deployment name version 4!')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
