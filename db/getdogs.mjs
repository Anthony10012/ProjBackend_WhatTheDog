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
                    CASE WHEN d.crossing = 1 THEN 'Oui' ELSE 'Non' END AS Croissing, 
                    CASE WHEN d.dead = 1 THEN 'Oui' ELSE 'Non' END AS Dead,
                    CASE WHEN d.sterilized = 1 THEN 'Oui' ELSE 'Non' END AS Sterilized, 
                    c.firstname as custumer_firstname, c.lastname as customer_lastname,
                    r.name as race_name 
                FROM dog d 
                JOIN
                    customer c ON d.Customer_idCustomer = c.idCustomer
                JOIN race r ON d.Race_idRace = r.idRace`;

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
                    CASE WHEN d.crossing = 1 THEN 'Oui' ELSE 'Non' END AS Croissing, 
                    CASE WHEN d.dead = 1 THEN 'Oui' ELSE 'Non' END AS Dead,
                    CASE WHEN d.sterilized = 1 THEN 'Oui' ELSE 'Non' END AS Sterilized, 
                    c.firstname as custumer_firstname, c.lastname as customer_lastname,
                    r.name as race_name 
                FROM dog d 
                JOIN
                    customer c ON d.Customer_idCustomer = c.idCustomer
                JOIN race r ON d.Race_idRace = r.idRace`;

            const [rows] = await con.query(sqlQuery);

            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

}

export {dbdogs}