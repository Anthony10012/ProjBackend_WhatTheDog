import express  from "express";

import {dblocality} from "../db/getlocality.js"; //Import de la connexion a la bd

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

export {localityRouter}