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

customerRouter.delete("/:id", async (req, res) => {
    try {
        const customerId = req.params.id;

        // Vérifier que l'ID est un entier positif
        if (!/^\d+$/.test(customerId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        // Vérifier si le client existe
        const customer = await dbcustomers.getAllCustomersById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Aucun client trouvé avec cet ID" });
        }

        // Essayer de supprimer le client
        try {
            const deleted = await dbcustomers.deleteCustomer(customerId);
            if (!deleted) {
                return res.status(404).json({ message: "Aucun client trouvé avec cet ID" });
            }
            res.status(200).json({ message: "Client supprimé avec succès" });
        } catch (error) {
            // Gestion du cas où le client a des chiens
            if (error.message.includes("chiens associés")) {
                return res.status(400).json({ message: error.message });
            }
            throw error; // autres erreurs serveur
        }

    } catch (error) {
        console.error("Erreur lors de la suppression du client :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export {customerRouter}