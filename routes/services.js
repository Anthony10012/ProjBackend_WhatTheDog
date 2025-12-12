import express  from "express";

import {dbservice} from "../db/getservices.js"; //Import de la connexion a la bd
import {isValidID} from "../helper.mjs";
import {dblocality} from "../db/getlocality.js";
import {localityRouter} from "./locality.js";

//on importe la bd, la fonction isvalid de helper.mjs

// on déclare la variable customerRouter
const serviceRouter = express.Router();

// fonction pour chercher tous les services
serviceRouter.get('/',async (req,res)=>{
    try{
        let service
        //Appele de la fonction getAllService
        service = await dbservice.getAllService();
        res.json(service); // Renvoye les services en format JSON
    }catch (error){
        res.status(500).json({error:error.message})
    }

});

serviceRouter.get('/place',async (req, res)=>{
    try{
        const servicePlace = req.query.place;

        if (!servicePlace || servicePlace.trim() === ''){
            return res.status(400).json({error:"place invalide"});
        }

        const service = await dbservice.getAllserviceByPlace(servicePlace.trim());

        if (service.length === 0) {
            res.status(404).json({error:"Aucune place trouvée"});
        } else {
            res.status(200).json({service});
        }

    } catch (error) {
        console.error("Erreur lors de la recherche")
        res.status(500).json({error:error.message})
    }
});


// fonction pour chercher les id des services
serviceRouter.get('/:id',async (req,res)=>{
    try {
        const idService = parseInt(req.params.id);
        if (!isValidID(idService)){
            return res.status(400).json({error:"ID invalide"});
        }
        const service = await dbservice.getServicesById(idService);
        if (service === undefined){
            res.status(404).json({error:"Customer introuvable"});
        }else{
            res.json({service})
        }

    } catch (error){
        res.status(500).json({error:error});
    }
});
export {serviceRouter}