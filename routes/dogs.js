import express from 'express';
import {db} from '../db/db-dogs.js';

const whatTheDogRouter = express.Router();

// Route GET pour récupérer toutes les activités
whatTheDogRouter.get("/", async (req, res)=>{
    try {
        const name = req.query.name;
        let limit;
        if (req.query.limit){
            limit = parseInt(req.query.limit);
        } else {
            limit = null;
        }

        let activities;
        if (name){
            if (name.length <= 2){
                return res.status(404).json({error : "Le paramètre de recherche doit contenir au moins 3 caractères."})
            } else {
                activities = await db.getActByName(name, limit);
            }
        } else {
            activities = await db.getAllActs(limit);
        }
        if (activities.length === 0) {
            return res.status(404).json({ message: "Aucune chien trouvé." });
        }
        res.json({activities});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

// Route GET pour récupérer une seule activité par son ID
activitiesRouter.get("/:id", async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        // Validation de l'ID (400 Bad Request)
        if (!isValidId(id)){
            return res.status(400).json({error : "ID Invalide"});
        }
        // Vérification de l'existance de la ressource (404 Not Found)
        const activity = await db.getActById(id);
        if (activity === undefined){
            res.status(404).json({error : "Activité non trouvé"});
        } else {
            res.json({activity});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

activitiesRouter.post("/", async (req, res) => {
    // déstructure le corps de la requête pour récupérer les données
    try {
        const {name, date, duration} = req.body;
        if (!isValidDate(date)) {
            return res.status(400).json({error: "Date non valide"});
        }
        if (!isValidDuration(duration)) {
            return res.status(400).json({error: "Durée non valide"});
        }

        const newActivity = await db.createAct({name, date, duration});
        // Ajouter la nouvelle activité à l'array
        // activities.push(newActivity);
        const message = `La nouvelle activité ${newActivity.name} a bien été crée`;
        res.json({message: message, activity: newActivity});
    } catch (error) {
        res.status(500).json({error:error});
    }
});

// Route put pour mettre à jour une activité existant
activitiesRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {name, date, duration} = req.body;
        const actUpdated = await db.updateAct(id, {name, date, duration});
        if (actUpdate === 0) {
            res.status(404).json({error: "Chien non trouvé"});
        } else {
            const actUpdated = await db.getActById(id);
            res.json({message: 'Activity updated', activity: actUpdated});
        }
    } catch (error) {
        res.status(500).json({error:error});
    }
});

activitiesRouter.delete('/:id', async (req,res)=>{
    try {
        const id = parseInt(req.params.id);
        // const index = activities.findIndex(activity => activity.id === id);
        // activities.splice(index,1);
        let deletedAct = await db.deleteAct(id)
        if (deletedAct.sucess) {
            res.json({message: 'Activity deleted'});
        } else {
            res.json(404).json({error: "Activité non trouvé"});
        }
    } catch (error){
        res.status(500).json({error:error});
    }
});

export default activitiesRouter;