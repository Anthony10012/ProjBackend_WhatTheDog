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

whatTheDogRouter.post('/',async (req,res)=>{
    try{
        const newDog = req.body;

        const requiredFields = [
            'firstname', 'sex', 'crossing', 'birthdate','dead','sterilized','Customer_idCustomer','Race_idRace'
        ];

        const missingFields = requiredFields.filter(field => !newDog[field] === undefined || newDog[field] === null);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error:`Champs manquants: ${missingFields.join(',')}`,
            });
        }

        const dogId  = await dbdogs.createdogs(newDog);

        res.status(201).json({
            message: "Chien créé",
            id: dogId,
            data: newDog
        });
    } catch (error) {
        console.error("Erreur lors de la création d'un chien",error)

        res.status(500).json({error:"Erreur serveur"});
    }
});


whatTheDogRouter.put('/:id', async (req, res) => {
    try {
        const idDog = parseInt(req.params.id);
        const rawData = req.body;

        if (isNaN(idDog)) return res.status(400).json({ error: "ID invalide" });

        // Normalisation des données : Conversion Oui/Non -> 1/0
        // Et s'assurer qu'on utilise les bons noms de champs (minuscules)
        const dogData = {
            firstname: rawData.firstname,
            sex: rawData.sex,
            birthdate: rawData.birthdate,
            crossing: rawData.Crossing === "Oui" ? 1 : 0,
            dead: rawData.Dead === "Oui" ? 1 : 0,
            sterilized: (rawData.Sterilized === "Oui" || rawData.Sterilized === "oui") ? 1 : 0,
            customer_firstname: rawData.customer_firstname,
            customer_lastname: rawData.customer_lastname,
            idRace: rawData.idRace
        };

        // Validation simple
        if (!dogData.idRace) {
            return res.status(400).json({ error: "L'ID de la race (idRace) est obligatoire pour changer la race." });
        }

        const affectedRows = await dbdogs.updateDogs(idDog, dogData);

        if (affectedRows === 0) {
            res.status(404).json({ error: "Chien non trouvé" });
        } else {
            res.status(200).json({ message: "Mis à jour !", data: dogData });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

whatTheDogRouter.delete("/:id",async (req,res)=>{
    try{
        const dogId  = req.params.id;

        if (!isValidID(dogId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const deleted = await dbdogs.deleteDog(dogId)

        if (!deleted){
            return res.status(404).json({
                message:"Aucun chien trouvé avec cet ID"
            });
        }


        res.status(200).json({
                message:"Chien supprimé avec succès"
            }
        )
    }catch (error){
        console.error("Erreur lors de la suppression du chien :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ... (Les autres routes POST, PUT, DELETE pour les activités restent telles quelles,
// mais devraient être renommées pour les chiens si l'objectif est un CRUD complet pour les chiens).

// Changement d'export par défaut
export default whatTheDogRouter;
