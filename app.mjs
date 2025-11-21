import express from 'express'
import whatTheDogRouter from './routes/dogs.js';
const app = express()
const port = process.env.PORT || 3003

import {customerRouter} from './routes/customer.js'
import {localityRouter} from './routes/locality.js'

//express comprend ainsi les données que l'on retourne (les requêtes entrantes) sont au format json
app.use(express.json());
app.use('/api/customers',customerRouter);
app.get('/', (req, res) => {
    res.send('Hello !')
})

app.get('/api/', (req, res) => {
    res.redirect(`http://localhost:${port}/`)
})

app.use('/api/dogs', whatTheDogRouter)
app.use('/api/locality', localityRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
