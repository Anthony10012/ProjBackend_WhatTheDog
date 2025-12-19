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

    createLocality: async (locality)=>{
        let con;
        try {
            con= await db.connectToDatabase();

            const sql = `
                INSERT INTO Locality 
                (name, postal_code, toponym, canton_code, language_code)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                locality.name,
                locality.postal_code,
                locality.toponym,
                locality.canton_code,
                locality.language_code
            ]

            const [result] = await con.query(sql, values);

            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un client");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    updateLocality: async (idLocality, localityData) => {
        let con;
        try {
            con = await db.connectToDatabase();

            // On ne JOIN pas la table race ici car on veut modifier la référence (FK)
            // dans la table dog, pas le contenu de la table race.
            const sql = `Update Locality SET name = ?, postal_code = ?, toponym = ?, canton_code = ?, language_code = ? WHERE idLocality = ?`;

            const values = [
                localityData.name,
                localityData.postal_code,
                localityData.toponym,
                localityData.canton_code,
                localityData.language_code,
                idLocality,
            ];

            const [result] = await con.query(sql, values);
            return result.affectedRows;
        } catch (error) {
            console.error("Erreur BD lors de la mise à jour", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dblocality}