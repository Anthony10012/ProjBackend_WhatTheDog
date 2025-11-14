import express  from "express";



const customerRouter = express.Router();

customerRouter.get('/',(req,res)=>{
    const sql = 'SELECT * FROM customers';
    db.query(sql,(err,results)=>{
        if (err){
            console.error('Erreur SQL :',err);
            return res.status(500).json({error:'Erreur serveur'})
        }
        res.json(results);
    })


});

export {customerRouter}