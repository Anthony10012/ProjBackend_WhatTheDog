import {db} from "./db-whatTheDog.mjs"
const dbdogs = {
    // fonction pour récupérer tous les chiens de la base de donnée
    getAllDogs: async () => {
        let con;
        // si la base de donnée n'arrive pas à récup les données voulu, il lancera le message d'erreur
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    d.iddog, d.firstname, d.sex, d.birthdate, 
                    CASE WHEN d.crossing = 1 THEN 'Oui' ELSE 'Non' END AS crossing, 
                    CASE WHEN d.dead = 1 THEN 'Oui' ELSE 'Non' END AS dead,
                    CASE WHEN d.sterilized = 1 THEN 'Oui' ELSE 'Non' END AS sterilized, 
                    c.firstname as customer_firstname, c.lastname as customer_lastname,
                    r.name as race_name,
                    IFNULL (m.name, 'Aucune maladie') as illness_name
                FROM dog d 
                JOIN customer c ON d.Customer_idCustomer = c.idCustomer
                JOIN race r ON d.Race_idRace = r.idRace
                LEFT JOIN dog_has_illness di on d.iddog = di.dog_iddog
                LEFT JOIN illness m ON di.Illness_idillness = m.idillness
                ORDER BY d.iddog`;

            const [rows] = await con.query(sqlQuery);

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
    getDogsById: async (id) => {
        let con;
        try {
            //récupère les données de la tables dog en prenant l'id
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    d.iddog, d.firstname, d.sex, d.birthdate, 
                    CASE WHEN d.crossing = 1 THEN 'Oui' ELSE 'Non' END AS crossing, 
                    CASE WHEN d.dead = 1 THEN 'Oui' ELSE 'Non' END AS dead,
                    CASE WHEN d.sterilized = 1 THEN 'Oui' ELSE 'Non' END AS sterilized, 
                    c.firstname as customer_firstname, c.lastname as customer_lastname,
                    r.name as race_name,
                    IFNULL (m.name, 'Aucune maladie') as illness_name
                FROM dog d
                JOIN
                    customer c ON d.Customer_idCustomer = c.idCustomer
                JOIN race r ON d.Race_idRace = r.idRace
                LEFT JOIN dog_has_illness di on d.iddog = di.dog_iddog
                LEFT JOIN illness m ON di.Illness_idillness = m.idillness
                WHERE d.iddog = ?`;

            const [rows] = await con.query(sqlQuery, [id]);

            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    getAllDogsByfirstname: async (firstname) =>{
        let con;
        try{
            con = await db.connectToDatabase()

            const searchTerm = `%${firstname}%`;
            const sqlQuery = `
                SELECT 
                    d.iddog, d.firstname, d.sex, d.birthdate, 
                    CASE WHEN d.crossing = 1 THEN 'Oui' ELSE 'Non' END AS crossing, 
                    CASE WHEN d.dead = 1 THEN 'Oui' ELSE 'Non' END AS dead,
                    CASE WHEN d.sterilized = 1 THEN 'Oui' ELSE 'Non' END AS sterilized, 
                    c.firstname as customer_firstname, c.lastname as customer_lastname,
                    r.name as race_name,
                    IFNULL (m.name, 'Aucune maladie') as illness_name
                FROM dog d
                JOIN
                    customer c ON d.Customer_idCustomer = c.idCustomer
                JOIN race r ON d.Race_idRace = r.idRace
                LEFT JOIN dog_has_illness di on d.iddog = di.dog_iddog
                LEFT JOIN illness m ON di.Illness_idillness = m.idillness
                WHERE d.firstname LIKE ?`
            const [rows] = await con.query(sqlQuery, [searchTerm]);
            return rows;
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    createdogs: async (dog)=>{
        let con;
        try {
            con= await db.connectToDatabase();

            const sql = `
                INSERT INTO dog 
                (firstname, sex, crossing, birthdate, dead, sterilized, Customer_idCustomer,Race_idRace)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                dog.firstname,
                dog.sex,
                dog.crossing,
                dog.birthdate,
                dog.dead,
                dog.sterilized,
                dog.Customer_idCustomer,
                dog.Race_idRace
            ]

            const [result] = await con.query(sql, values);

            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un chien");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    updateDogs: async (idDog, dogData) => {
        let con;
        try {
            con = await db.connectToDatabase();

            // On ne JOIN pas la table race ici car on veut modifier la référence (FK)
            // dans la table dog, pas le contenu de la table race.
            const sql = `
                UPDATE dog d
                    JOIN customer c
                ON d.Customer_idCustomer = c.idCustomer
                    SET
                        d.firstname = ?, d.sex = ?, d.birthdate = ?, d.crossing = ?, d.dead = ?, d.sterilized = ?, d.Race_idRace = ?, -- On change l'ID de la race du chien ici
                        c.firstname = ?, c.lastname = ?
                WHERE d.iddog = ?`;

            const values = [
                dogData.firstname,
                dogData.sex,
                dogData.birthdate,
                dogData.crossing,
                dogData.dead,
                dogData.sterilized,
                dogData.idRace,
                dogData.customer_firstname,
                dogData.customer_lastname,
                idDog
            ];

            const [result] = await con.query(sql, values);
            return result.affectedRows;
        } catch (error) {
            console.error("Erreur BD lors de la mise à jour", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    deleteDog: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();

            const sql = `DELETE FROM dog WHERE iddog = ?`;

            const [result] = await con.query(sql, [id]);

            // Vérifie si un chien a été supprimé
            if (result.affectedRows === 0) {
                return null; // Aucun chien trouvé
            }

            return true; // Suppression OK
        } catch (error) {
            console.error("Erreur BDD lors de la suppression d'un chien :", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }

}

export {dbdogs}