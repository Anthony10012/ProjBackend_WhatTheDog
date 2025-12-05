import express from 'express';
import {dbdogs} from '../db/getdogs.mjs';
import {isValidID} from "../helper.mjs";


const whatTheDogRouter = express.Router();


// Route GET pour récupérer tous les chiens (dogs)
whatTheDogRouter.get("/", async (req, res)=>{
    try{
        //Appele de  la fonction GetAllDogs
        const dogs = await dbdogs.getAllDogs();
        res.json(dogs);
    }catch (error){
        res.status(500).json({error:error.message})
    }
});

whatTheDogRouter.get('/firstname',async (req, res)=>{
    try{
        const dogfirstname = req.query.firstname;

        if (!dogfirstname || dogfirstname.trim() === ''){
            return res.status(400).json({error:"prénom invalide"});
        }

        const dogs = await dbdogs.getAllDogsByfirstname(dogfirstname.trim());

        if (dogs.length === 0) {
            res.status(404).json({error:"Aucun chien trouvé"});
        } else {
            res.status(200).json({dogs})
        }

    } catch (error) {
        console.error("Erreur lors de la recherche")
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
        const dog = await dbdogs.getDogsById(idDog);

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
