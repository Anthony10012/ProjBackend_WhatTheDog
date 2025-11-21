import mysql from 'mysql2/promise';
// on importe mysql2 afin de pouvoir faire la connexion à la database

// On entre les coordonnées du compte SQL avec la base de donnée exécutée afin que le code puisse récupérer les données
// sync => attend que la fonction soit finie pour passer a la suivante
// async => passe a la suite meme si la fonction n est pas terminée
// await => termine de traiter d'autres taches pendant qu il attend le resultat
const db = {
    connectToDatabase: async () => {
        // Utilisation de mysql.createConnection est correcte pour les connexions à usage unique
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'what_the_dog',
        });
        return con;
    },

    // fonction pour se déconnecter de la base de donnée
    disconnectFromDatabase: async (con) => {
        // on a mis gestion d'erreur qui dit que si le programme essaie de se déconnecter mais n'y arrive pas,
        // il lancera un message d'erreur
        try {
            await con.end();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    },

    // fonction pour récupérer tous les chiens de la base de donnée
    getAllDogs: async () => {
        let con;
        // si la base de donnée n'arrive pas à récup les données voulu, il lancera le message d'erreur
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM dog');
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
            const [rows] = await con.query('SELECT * FROM dog WHERE iddog = ?', [id]);
            // Retourne le premier résultat ou undefined si le tableau est vide
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // fonction pour récupérer tous les customers
    getAllCustomers:async ()=>{
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM customer'); // SQL correct
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // fonction pour récupérer l'id de la base de donnée
    getAllCustomersById: async (idCustomer)=>{
        let con;
        try{
            con = await db.connectToDatabase()
            const [rows] = await con.query('SELECT * FROM customer WHERE idCustomer = ?',[idCustomer]);
            return rows[0];
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

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
    /*

    createDogs: async ({nom, dateDebut, duree}) => { // CORRECTION: Utiliser 'duree' (sans accent) pour la cohérence
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.query(
                'INSERT INTO activities (nom, dateDebut, duree) VALUES (?, ?, ?)',
                [nom, dateDebut, duree] // CORRECTION: Utiliser 'duree'
            );
            // Retourne l'objet d'activité créé
            return {id: result.insertId, nom, dateDebut, duree};
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    updateActivities: async (id, {nom, dateDebut, duree}) => { // CORRECTION: Utiliser 'duree' et l'ID dans la signature
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.query(
                // CORRECTION MAJEURE: Mettre l'ID dans la clause WHERE et 'duree' dans le SET
                `UPDATE activities
                 SET nom = ?,
                     dateDebut = ?,
                     duree = ?
                 WHERE id = ?`,
                [nom, dateDebut, duree, id]
            );
            // Retourne le nombre de lignes affectées (0 ou 1)
            return result.affectedRows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    deleteActivities: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.query('DELETE FROM activities WHERE id = ?', [id]);

            if (result.affectedRows > 0) {
                // Retourne {success: true} pour être utilisé par le routeur
                return {success: true};
            } else {
                // Retourne {success: false} si aucune ligne n'a été trouvée/supprimée
                return {success: false, message: 'Activité non trouvée.'};
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    // ajout d'une fonction pour gérer la recherche par le nom
    searchActivitiesByName: async (name) => {
        let con;
        try {
            con = await db.connectToDatabase();

            //    Ceci permet de trouver la chaîne 'name' n'importe où dans le champ 'nom'.
            const searchPattern = `%${name}%`;

            // 2. Utilisation de LIKE avec le motif et des requêtes préparées (le '?' dans la clause WHERE)
            const [rows] = await con.query(
                'SELECT * FROM activities WHERE nom LIKE ?',
                [searchPattern]
            );

            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }


 */
}


export { db }
