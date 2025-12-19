import express  from "express";

import {dblocality} from "../db/getlocality.js";
import {dbdogs} from "../db/getdogs.mjs";
import whatTheDogRouter from "./dogs.js";
import {isValidID} from "../helper.mjs";
import {dbcustomers} from "../db/getcustomers.js";
import {customerRouter} from "./customer.js";

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

localityRouter.put('/:id',async (req,res)=>{
    try {
        const idLocality = parseInt(req.params.id);
        const localityData = req.body;

        // 1. Validation de l'ID dans l'URL
        if (!isValidID(idLocality)) {
            return res.status(400).json({ error: "ID de la localité invalide dans l'URL" });
        }

        // 2. Validation des champs requis dans le corps de la requête
        const requiredFields = [
            'name', 'postal_code', 'toponym', 'canton_code', 'language_code',
        ];

        const missingFields = requiredFields.filter(field => localityData[field] === undefined);

        if (missingFields.length > 0) {
            // J'ajoute 'gender' et 'tel_number' car pour un PUT, on s'attend à ce que toutes les données
            // du client soient fournies pour la mise à jour complète (contrairement au PATCH)
            return res.status(400).json({
                error: `Champs manquants ou incomplets pour la mise à jour : ${missingFields.join(', ')}`,
            });
        }

        // 3. Appel de la fonction de la BDD pour la mise à jour
        const affectedRows = await dblocality.updateLocality(idLocality, localityData);

        if (affectedRows === 0) {
            // Si 0 lignes affectées, cela signifie que l'ID n'a pas été trouvé
            res.status(404).json({ error: `Client avec l'ID ${idLocality} introuvable.` });
        } else {
            // Succès
            res.status(200).json({
                message: `La localité ${idLocality} mis à jour avec succès.`,
                data: localityData
            });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour d'une localité:", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
});

export {localityRouter}