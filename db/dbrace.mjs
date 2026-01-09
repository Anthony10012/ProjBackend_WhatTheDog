import {db} from "./db-whatTheDog.mjs"

const dbrace = {

    // Recupere toutes les races
    getAllRaces:async ()=>{
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query("SELECT * FROM race");
            return rows;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    //  Récupére une race par ID
    getRaceById: async (idRace) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query(
                "SELECT * FROM race WHERE idRace = ?",
                [idRace]
            );
            return rows[0];
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    //  Recherche par nom
    getRacesByName: async (name) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const search = `%${name}%`;
            const [rows] = await con.query(
                "SELECT * FROM race WHERE name LIKE ?",
                [search]
            );
            return rows;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    //  Créer une race
    createRace: async (race) => {
        let con;
        try {
            con = await db.connectToDatabase();

            const sql = `
                INSERT INTO race
                (name, category, morphotype, classification,
                 sizeMin_F, sizeMax_F, sizeMin_M, sizeMax_M,
                 weightMin_F, weightMax_F, weightMin_M, weightMax_M,
                 life_expectancy)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                race.name,
                race.category,
                race.morphotype,
                race.classification,
                race.sizeMin_F,
                race.sizeMax_F,
                race.sizeMin_M,
                race.sizeMax_M,
                race.weightMin_F,
                race.weightMax_F,
                race.weightMin_M,
                race.weightMax_M,
                race.life_expectancy
            ];

            const [result] = await con.query(sql, values);
            return result.insertId;

        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    // Supprimer une race (sécurisé)
    deleteRace: async (idRace) => {
        let con;
        try {
            if (!/^\d+$/.test(idRace)) {
                throw new Error("ID invalide");
            }

            con = await db.connectToDatabase();

            // Vérifier si des chiens utilisent cette race
            const [dogs] = await con.query(
                "SELECT * FROM dog WHERE Race_idRace = ?",
                [idRace]
            );

            if (dogs.length > 0) {
                throw new Error(
                    "Impossible de supprimer la race : des chiens y sont encore associés"
                );
            }

            const [result] = await con.query(
                "DELETE FROM race WHERE idRace = ?",
                [idRace]
            );

            return result.affectedRows > 0;

        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
};
export {dbrace}