import express from 'express';
import activitiesRouter from './routes/dogs.js';

// créer une application Express
const app = express();

// définir le port sur lequel le serveur va écouter
const port = process.env.PORT || 3000;

// Indiquer que le format qu'on ajouter est au format json
app.use(express.json());

// utiliser le routeur pour toutes les routes commençant pas `/activities`
app.use('/whatTheDog', activitiesRouter);

app.use(({ res }) => {
    const message =
        "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
    res.status(404).json(message);
});

// Démarrer serveur web sur le port indiqué
app.listen(port,()=> {
    console.log(`Serveur listening on http://localhost:${port}`);
});
