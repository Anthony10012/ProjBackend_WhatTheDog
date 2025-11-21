import express  from "express";

import {dbservice} from "../db/getservices.js"; //Import de la connexion a la bd
import {isValidID} from "../helper.mjs";

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