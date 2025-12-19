import express  from "express";

import {dbservice} from "../db/getservices.js"; //Import de la connexion a la bd
import {isValidID} from "../helper.mjs";
import {dblocality} from "../db/getlocality.js";
import {localityRouter} from "./locality.js";
import {dbdogs} from "../db/getdogs.mjs";
import whatTheDogRouter from "./dogs.js";

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

serviceRouter.post('/',async (req,res)=>{
    try{
        const newService = req.body;

        const requiredFields = [
            'date', 'place', 'duration_service'
        ];

        const missingFields = requiredFields.filter(field => !newService[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error:`Champs manquants: ${missingFields.join(',')}`,
            });
        }

        const serviceId  = await dbservice.createservice(newService);

        res.status(201).json({
            message: "Service créé",
            id: serviceId,
            data: newService
        });
    } catch (error) {
        console.error("Erreur lors de la création d'un service",error)

        res.status(500).json({error:"Erreur serveur"});
    }
});

serviceRouter.put('/:id',async (req,res)=>{
    try {
        const idService = parseInt(req.params.id);
        const serviceData = req.body;

        // 1. Validation de l'ID dans l'URL
        if (!isValidID(idService)) {
            return res.status(400).json({ error: "ID d'un service invalide dans l'URL" });
        }

        // 2. Validation des champs requis dans le corps de la requête
        const requiredFields = [
            'date', 'place', 'duration_service',
        ];

        const missingFields = requiredFields.filter(field => serviceData[field] === undefined);

        if (missingFields.length > 0) {
            // J'ajoute 'gender' et 'tel_number' car pour un PUT, on s'attend à ce que toutes les données
            // du client soient fournies pour la mise à jour complète (contrairement au PATCH)
            return res.status(400).json({
                error: `Champs manquants ou incomplets pour la mise à jour : ${missingFields.join(', ')}`,
            });
        }

        // 3. Appel de la fonction de la BDD pour la mise à jour
        const affectedRows = await dbservice.updateService(idService, serviceData);

        if (affectedRows === 0) {
            // Si 0 lignes affectées, cela signifie que l'ID n'a pas été trouvé
            res.status(404).json({ error: `Service avec l'ID ${idService} introuvable.` });
        } else {
            // Succès
            res.status(200).json({
                message: `Le service ${idService} mis à jour avec succès.`,
                data: serviceData
            });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour d'un service:", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
});

export {serviceRouter}