import {db} from "./db-whatTheDog.mjs"
const dbservice = {
    // fonction pour récupérer tous les services de la base de donnée
    getAllService: async () => {
        let con;
        // si la base de donnée n'arrive pas à récup les données voulu, il lancera le message d'erreur
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM service');
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            // si la base de donnée est connecté, la déconnecte
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // fonction pour récupérer l'id de la base de donnée
    getServicesById: async (id) => {
        let con;
        try {
            //récupère les données de la tables dog en prenant l'id
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM service WHERE idService = ?', [id]);
            // Retourne le premier résultat ou undefined si le tableau est vide
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    getAllserviceByPlace: async (place) =>{
        let con;
        try{
            con = await db.connectToDatabase()
            const searchTerm = `%${place}%`;

            const [rows] = await con.query('SELECT * FROM service WHERE place LIKE ?', [searchTerm]);
            return rows;
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    createservice: async (service)=>{
        let con;
        try {
            con= await db.connectToDatabase();

            const sql = `
                INSERT INTO service 
                (date, place, duration_service)
                VALUES (?, ?, ?)
            `;

            const values = [
              service.date,
              service.place,
              service.duration_service
            ]

            const [result] = await con.query(sql, values);

            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un service");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dbservice};