import express from 'express';
import {db} from '../db/db-whatTheDog.mjs';
import {isValidID} from "../helper.mjs";

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
whatTheDogRouter.get("/:id", async (req, res) =>{
    try {
        const idDog = parseInt(req.params.id);
        if (!isValidID(idDog)){
            return res.status(400).json({error:"ID invalide"});
        }
        const dog = await db.getDogsById(idDog);

        // CORRECTION: Ajouter return pour stopper l'exécution
        if (dog === undefined){
            return res.status(404).json({error:"Dog introuvable"}); // Mieux de dire "Dog" ici
        }

        // S'il n'y a pas eu de 404, on envoie la réponse réussie
        res.json({dog})

    } catch (error){
        // Le bloc catch attrape les erreurs de la BDD (getDogsById)
        res.status(500).json({error: error.message || "Erreur serveur"});
    }
});

// ... (Les autres routes POST, PUT, DELETE pour les activités restent telles quelles,
// mais devraient être renommées pour les chiens si l'objectif est un CRUD complet pour les chiens).

// Changement d'export par défaut
export default whatTheDogRouter;
