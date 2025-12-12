import express  from "express";

import {dblocality} from "../db/getlocality.js";
import {dbdogs} from "../db/getdogs.mjs";
import whatTheDogRouter from "./dogs.js";

const localityRouter = express.Router();

localityRouter.get('/',async (req,res)=>{
    try{
        //Appele de  la fonction AllLocality
        const localities = await dblocality.getAllLocality();
        res.json(localities); // renvoie les localités en format JSON
    }catch (error){
        res.status(500).json({error:error.message})
    }

});

localityRouter.get('/name',async (req, res)=>{
    try{
        const localityName = req.query.name;

        if (!localityName || localityName.trim() === ''){
            return res.status(400).json({error:"nom invalide"});
        }

        const locality = await dblocality.getAllLocByName(localityName.trim());

        if (locality.length === 0) {
            res.status(404).json({error:"Aucune localité trouvée"});
        } else {
            res.status(200).json({locality});
        }

    } catch (error) {
        console.error("Erreur lors de la recherche")
        res.status(500).json({error:error.message})
    }
});

const isValidId = (id) => {
    // Check if the conversion to number was successful and if the ID is positive
    return !isNaN(id) && id > 0;
};

// Route GET pour récupérer un seul localité par son ID
localityRouter.get("/:id", async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        // Validation de l'ID (400 Bad Request)
        if (!isValidId(id)){
            return res.status(400).json({error : "ID Invalide"});
        }
        // Vérification de l'existance de la ressource (404 Not Found)
        const locality = await dblocality.getLocById(id);
        if (locality === undefined){
            res.status(404).json({error : "Activité non trouvé"});
        } else {
            res.json({locality});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


localityRouter.post('/',async (req,res)=>{
    try{
        const newLocality = req.body;

        const requiredFields = [
            'name', 'postal_code', 'toponym', 'canton_code','language_code'
        ];

        const missingFields = requiredFields.filter(field => !newLocality[field] === undefined || newLocality[field] === null);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error:`Champs manquants: ${missingFields.join(',')}`,
            });
        }

        const localityId  = await dblocality.createLocality(newLocality);

        res.status(201).json({
            message: "Localité ajouté",
            id: localityId,
            data: newLocality
        });
    } catch (error) {
        console.error("Erreur lors de la création d'un chien",error)

        res.status(500).json({error:"Erreur serveur"});
    }
});

export {localityRouter}