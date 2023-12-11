import express, { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World version 6')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
