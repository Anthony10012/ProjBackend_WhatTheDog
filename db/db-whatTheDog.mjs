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
            password: '',
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
}


export { db }
