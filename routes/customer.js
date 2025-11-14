import express  from "express";

import {db} from "../db/db-whatTheDog.mjs"; //Import de la connexion a la bd

const customerRouter = express.Router();

customerRouter.get('/',async (req,res)=>{
    try{
        //Appele de  la fonction Allcustomers
        const customers = await db.getAllCustomers();
        res.json(customers); // renvoye les clients en format JSON
    }catch (error){
        res.status(500).json({error:error.message})
    }

});

export {customerRouter}