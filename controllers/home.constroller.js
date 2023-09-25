const ejs = require("ejs");
const { createDbConnection } = require("../outil/db.utils");
const cheminRacine = `${require.main.path}/views/home/`;

const promiseRender = (nomFichier, objet, res) => {
  ejs
    .renderFile(`${cheminRacine}${nomFichier}`, objet)
    .then((pageRender) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pageRender);
    })
    .catch((error) => {
      res.writeHead(500);
      res.end();
    });
};
// ______________________________________
const promiseRenderimage = (nomFichier, objet, res, image) => {
  ejs
    .renderFile(`${cheminRacine}${nomFichier}`, objet, image)
    .then((pageRender) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pageRender);
    })
    .catch((error) => {
      res.writeHead(500);
      res.end();
    });
};
// _____________________________________
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
    const CC = "../views/home/asset/image/CC.jpg";

    console.log(message);
    //  / : Page d'accueil du resto (Nom, texte de présentation, images)
    promiseRenderimage("index.ejs", { message, CC }, res);
  },

  menu(req, res) {
    //  /menu : Liste des plats (Pour chaque plat : Nom, briève description, prix)
    promiseRender("menu.ejs", {}, res);
  },

  plat(req, res) {
    //  /menu/:id : Detail d'un plat (Nom, description complète, image, prix, allergène)
    promiseRender("menu.id.ejs", {}, res);
  },

  info(req, res) {
    //  /about       : Page d'info du resto
    promiseRender("info.ejs", {}, res);
  },

  messageGET(req, res) {
    //  /comment     : Page de commentaire des clients
    promiseRender("commentaire.ejs", {}, res);
  },

  messagePOST(req, res) {
    //  /comment/add : Page qui permet à un client d'ajouter un commentaire
    promiseRender("addCommentaire.ejs", {}, res);
  },
};
module.exports = homeControllers;
