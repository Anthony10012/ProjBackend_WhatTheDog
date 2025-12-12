import express  from "express";

import {dbcustomers} from "../db/getcustomers.js"; //Import de la connexion a la bd
import {isValidID} from "../helper.mjs";

//on importe la bd, la fonction isvalid de helper.mjs

// on déclare la variable customerRouter
const customerRouter = express.Router();

// fonction pour chercher tous les customers
customerRouter.get('/',async (req,res)=>{
    try{
        let customers
        //Appele de  la fonction getAllCustomers
        customers = await dbcustomers.getAllCustomers();
        res.json(customers); // Renvoye les clients en format JSON
    }catch (error){
        res.status(500).json({error:error.message})
    }

});

customerRouter.get('/lastname',async (req,res)=>{
    try{
        const customerLastname = req.query.lastname;

        if (!customerLastname || customerLastname.trim() === ''){
            return res.status(400).json({error:"Nom invalide"});
        }

        const customers = await dbcustomers.getAllCustomersByLastname(customerLastname.trim());

        if (customers.length === 0) {
            res.status(404).json({error:"Aucun client trouvé"});
        } else {
            res.status(200).json({customers})
        }

    } catch (error) {
        console.error("Erreur lors de la recherche")
        res.status(500).json({error:error.message})
    }
});

// fonction pour chercher les id des customers
customerRouter.get('/:id',async (req,res)=>{
   try {
        const idCustomer = parseInt(req.params.id);
        if (!isValidID(idCustomer)){
            return res.status(400).json({error:"ID invalide"});
        }
        const customer = await dbcustomers.getAllCustomersById(idCustomer);
        if (customer === undefined){
            res.status(404).json({error:"Customer introuvable"});
        }else{
            res.json({customer})
        }

   } catch (error) {
       res.status(500).json({error: error});
   }
});

customerRouter.post('/',async (req,res)=>{
   try{
       const newCustomer = req.body;

       const requiredFields = [
           'lastname', 'firstname', 'email', 'Locality_idLocality', 'Service_idService'
       ];

       const missingFields = requiredFields.filter(field => !newCustomer[field]);

       if (missingFields.length > 0) {
           return res.status(400).json({
               error:`Champs manquants: ${missingFields.join(',')}`,
           });
       }

       const customerId  = await dbcustomers.createCustomer(newCustomer);

       res.status(201).json({
           message: "Client créé",
           id: customerId,
           data: newCustomer
       });
   } catch (error) {
       console.error("Erreur lors de la création d'un client")

       res.status(500).json({error:"Erreur serveur"});
   }
});

customerRouter.put('/:id',async (req,res)=>{
    try {
        const idCustomer = parseInt(req.params.id);
        const customerData = req.body;

        // 1. Validation de l'ID dans l'URL
        if (!isValidID(idCustomer)) {
            return res.status(400).json({ error: "ID client invalide dans l'URL" });
        }

        // 2. Validation des champs requis dans le corps de la requête
        const requiredFields = [
            'lastname', 'firstname', 'gender', 'email', 'tel_number',
            'postal_address', 'Locality_idLocality', 'Service_idService'
        ];

        const missingFields = requiredFields.filter(field => customerData[field] === undefined);

        if (missingFields.length > 0) {
            // J'ajoute 'gender' et 'tel_number' car pour un PUT, on s'attend à ce que toutes les données
            // du client soient fournies pour la mise à jour complète (contrairement au PATCH)
            return res.status(400).json({
                error: `Champs manquants ou incomplets pour la mise à jour : ${missingFields.join(', ')}`,
            });
        }

        // 3. Appel de la fonction de la BDD pour la mise à jour
        const affectedRows = await dbcustomers.updateCustomer(idCustomer, customerData);

        if (affectedRows === 0) {
            // Si 0 lignes affectées, cela signifie que l'ID n'a pas été trouvé
            res.status(404).json({ error: `Client avec l'ID ${idCustomer} introuvable.` });
        } else {
            // Succès
            res.status(200).json({
                message: `Client ${idCustomer} mis à jour avec succès.`,
                data: customerData
            });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour d'un client:", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
});

export {customerRouter}