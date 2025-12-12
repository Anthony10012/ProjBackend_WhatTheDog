import {db} from "./db-whatTheDog.mjs"
const dbcustomers = {
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

    getAllCustomersByLastname: async (lastname) =>{
        let con;
        try{
            con = await db.connectToDatabase()
            const searchTerm = `%${lastname}%`;

            const [rows] = await con.query('SELECT * FROM customer WHERE lastname LIKE ?', [searchTerm]);
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