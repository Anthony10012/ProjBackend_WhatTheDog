import {db} from "./db-whatTheDog.mjs"

const dbcustomers = {
    // fonction pour récupérer tous les customers
    getAllCustomers:async ()=>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    c.idCustomer, c.firstname, c.lastname , c.gender, 
                    c.email, c. tel_number, c.postal_address,
                    l.name as Town, 
                    s.place as Place_service, s.duration_service as Time
                FROM customer c 
                JOIN
                    locality l ON c.Locality_idLocality = l.idLocality
                JOIN service s ON c.Service_idService = s.idService`;

            const [rows] = await con.query(sqlQuery);

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
            const sqlQuery = `
                SELECT 
                    c.idCustomer, c.firstname, c.lastname , c.gender, 
                    c.email, c. tel_number, c.postal_address,
                    l.name as Town, 
                    s.place as Place_service, s.duration_service as Time
                FROM customer c 
                JOIN
                    locality l ON c.Locality_idLocality = l.idLocality
                JOIN service s ON c.Service_idService = s.idService
                WHERE idCustomer = ?`
            const [rows] = await con.query(sqlQuery,[idCustomer]);
            return rows[0];
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    getAllCustomersByLastname: async (lastname) =>{
        let con;
        try{
            con = await db.connectToDatabase()
            const searchTerm = `%${lastname}%`;
            const sqlQuery = `
                SELECT 
                    c.idCustomer, c.firstname, c.lastname , c.gender, 
                    c.email, c. tel_number, c.postal_address,
                    l.name as Town, 
                    s.place as Place_service, s.duration_service as Time
                FROM customer c 
                JOIN
                    locality l ON c.Locality_idLocality = l.idLocality
                JOIN service s ON c.Service_idService = s.idService
                WHERE lastname LIKE ?`
            const [rows] = await con.query(sqlQuery, [searchTerm]);
            return rows;
        }catch (err){
            console.log(err);
            throw err
        }finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    createCustomer: async (customer)=>{
        let con;
        try {
            con= await db.connectToDatabase();

            const sql = `
                INSERT INTO Customer 
                (lastname, firstname, gender, email, tel_number, postal_address, Locality_idLocality, Service_idService)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                customer.lastname,
                customer.firstname,
                customer.gender,
                customer.email,
                customer.tel_number,
                customer.postal_address,
                customer.Locality_idLocality,
                customer.Service_idService
            ]

            const [result] = await con.query(sql, values);

            return result.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un client");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export  {dbcustomers}