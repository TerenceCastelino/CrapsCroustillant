const ejs = require("ejs");
const { createDbConnection } = require("../outil/db.utils");
const cheminRacine = `${require.main.path}/views/home/`;

const promiseRender = (nomFichier, res) => {
  ejs
    .renderFile(`${cheminRacine}${nomFichier}`)
    .then((pageRender) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pageRender);
    })
    .catch((error) => {
      res.writeHead(500);
      res.end();
    });
};

const homeControllers = {
  index: async (req, res) => {
    //recuperation des données depuis la db
    const db = await createDbConnection();
    const result = await db.query("select *from Plats");
    const message = result.recordset.map((row) => {
      return {
        plat: row["NomDuPlat"],
      };
    });

    console.log(message);
    //  / : Page d'accueil du resto (Nom, texte de présentation, images)
    promiseRender("index.ejs", res);
  },

  menu(req, res) {
    //  /menu : Liste des plats (Pour chaque plat : Nom, briève description, prix)
    promiseRender("menu.ejs", res);
  },

  plat(req, res) {
    //  /menu/:id : Detail d'un plat (Nom, description complète, image, prix, allergène)
    promiseRender("menu.id.ejs", res);
  },

  info(req, res) {
    //  /about       : Page d'info du resto
    promiseRender("info.ejs", res);
  },

  messageGET(req, res) {
    //  /comment     : Page de commentaire des clients
    promiseRender("commentaire.ejs", res);
  },

  messagePOST(req, res) {
    //  /comment/add : Page qui permet à un client d'ajouter un commentaire
    promiseRender("addCommentaire.ejs", res);
  },
};
module.exports = homeControllers;
