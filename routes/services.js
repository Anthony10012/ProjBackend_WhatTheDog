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

whatTheDogRouter.put('/:id', async (req, res) => {
    try {
        const idDog = parseInt(req.params.id);

        // LOG ICI POUR VOIR CE QUI ARRIVE REELLEMENT
        console.log("ID reçu:", idDog);
        console.log("Body reçu:", req.body);

        const data = req.body;

        // On prépare l'objet pour la DB en étant tolérant sur la casse (Maj/Min)
        const dogData = {
            firstname: data.firstname || data.firstname,
            sex: data.sex,
            birthdate: data.birthdate,
            // On gère si c'est "Oui", 1, ou "1"
            crossing: (data.Crossing === "Oui" || data.crossing === "Oui" || data.Crossing == 1) ? 1 : 0,
            dead: (data.Dead === "Oui" || data.dead === "Oui" || data.Dead == 1) ? 1 : 0,
            sterilized: (data.Sterilized === "Oui" || data.sterilized === "Oui" || data.Sterilized == 1) ? 1 : 0,
            idRace: parseInt(data.idRace || data.Race_idRace),
            customer_firstname: data.customer_firstname,
            customer_lastname: data.customer_lastname
        };

        console.log("Objet formaté pour SQL:", dogData);

        const affectedRows = await dbdogs.updateDogs(idDog, dogData);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Aucune ligne modifiée. L'ID existe-t-il ?" });
        }

        res.status(200).json({ message: "ENFIN !", data: dogData });

    } catch (error) {
        console.error("ERREUR CRITIQUE:", error.message);
        res.status(500).json({ error: error.message });
    }
});
export {serviceRouter}