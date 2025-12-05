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
export {customerRouter}