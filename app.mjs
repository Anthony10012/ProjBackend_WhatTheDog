import express from 'express'
import whatTheDogRouter from './routes/dogs.js';
const app = express()
const port = process.env.PORT || 3003


//express comprend ainsi les données que l'on retourne (les requêtes entrantes) sont au format json
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello CHIHUHAHAHAHAHHAHAH!')
})

app.get('/api/', (req, res) => {
    res.redirect(`http://localhost:${port}/`)
})

app.use('/api/dogs', whatTheDogRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
