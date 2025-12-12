import {db} from "./db-whatTheDog.mjs"
const dblocality = {
    // on récupère toutes les localités
    getAllLocality:async ()=>{
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM locality'); // SQL correct
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // fonction pour récupérer l'id de la base de donnée
    getLocById: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM locality WHERE idLocality = ?', [id]);
            // Retourne le premier résultat ou undefined si le tableau est vide
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    getAllLocByName: async (name) =>{
        let con;
        try{
            con = await db.connectToDatabase()

            const searchTerm = `%${name}%`;

            // 2. On utilise l'opérateur LIKE au lieu de l'opérateur =
            const [rows] = await con.query('SELECT * FROM locality WHERE name LIKE ?', [searchTerm]);

            return rows;
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
}

export {dblocality}