import express from 'express';
import {db} from '../db/db-whatTheDog.mjs';

const whatTheDogRouter = express.Router();


// Route GET pour récupérer tous les chiens (dogs)
whatTheDogRouter.get("/", async (req, res)=>{
    try{
        //Appele de  la fonction GetAllDogs
        const dogs = await db.getAllDogs();
        res.json(dogs);
    }catch (error){
        res.status(500).json({error:error.message})
    }
});

// Le reste des routes (GET /:id, POST, PUT, DELETE) nécessitent
// aussi des changements de nom (activitiesRouter -> whatTheDogRouter,
// activities -> dogs, actUpdated -> dogUpdated, etc.)
// Voici la suite des routes avec les corrections de nom et d'import

// Route GET pour récupérer un seul chien par son ID
whatTheDogRouter.get("/:id", async (req, res) =>{ // CORRECTION: activitiesRouter -> whatTheDogRouter
    try {
        const id = parseInt(req.params.id);
        // Validation de l'ID (400 Bad Request)
        if (!isValidId(id)){ // NOTE: isValidId doit être importé/défini
            return res.status(400).json({error : "ID Invalide"});
        }
        // Vérification de l'existance de la ressource (404 Not Found)
        // CORRECTION: Utiliser getDogsById
        const dog = await db.getDogsById(id);
        if (dog === undefined){
            res.status(404).json({error : "Chien non trouvé"}); // CORRECTION: Activité -> Chien
        } else {
            res.json({dog}); // CORRECTION: activity -> dog
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// ... (Les autres routes POST, PUT, DELETE pour les activités restent telles quelles,
// mais devraient être renommées pour les chiens si l'objectif est un CRUD complet pour les chiens).

// Changement d'export par défaut
export default whatTheDogRouter;
