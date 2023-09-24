require("dotenv").config(); //<-- Chargement des variables d'environnement(.env)

// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
// VARIABLE_ENV____DEBUT_______>
const { PORT } = process.env; //<--Utilisation du destructuring
// VARIABLE_ENV____FIN_________<
// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//IMPORT_______DEBUT__________>
const http = require("http");
const homeControllers = require("./controllers/home.constroller");
const dbUtils = require("./outil/db.utils");
//IMPORT_______FIN____________<
// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
// TESTE_SERVER_______________>
dbUtils.testeDbConnection();
// TESTE_SERVER_______________<
// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//CREATION_SERVER____DEBUT____>
const server = http.createServer((req, res) => {
  console.log(`URL : ${req.url} / METHODE : ${req.method}`); //<--Info Requete
  // ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
  //________ROUTING______DEBUT_________➡️
  // ➖➖➖➖➖➖➖➖➖
  // ______________ / __________________
  if (req.url === "/") {
    homeControllers.index(req, res); // acceuil

    // ➖➖➖➖➖➖➖➖➖
    // ____________ /MENU _______________
  } else if (req.url === "/menu") {
    homeControllers.menu(req, res); // menu
    // ➖➖➖➖➖➖➖➖➖
    // __________ /MENU/:ID _____________
  } else if (req.url === "/menu/:id") {
    homeControllers.plat(req, res); // menuId
    // ➖➖➖➖➖➖➖➖➖
    // ____________ /INFO _______________
  } else if (req.url === "/info") {
    homeControllers.info(req, res); // info
    // ➖➖➖➖➖➖➖➖➖
    // _________ :COMMENTAIRE __________
  } else if (req.url === "/commentaire" && req.method === "GET") {
    homeControllers.messageGET(req, res); // commentaire
    // ➖➖➖➖➖➖➖➖➖
    // ______ :COMMENTAIRE/ADD _________
  } else if (req.url === "/commentaire/add" && req.method === "POST") {
    homeControllers.messagePOST(req, res); // ajouter commentaire
    // ➖➖➖➖➖➖➖➖➖
    // _________ ERROR_404 _____________
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Page non Trouver</h1>");
  } //________ROUTING______FIN_________⬅️
  // ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
}); //CREATION_SERVER____FIN______<
// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//DEMARRER_SERVER___DEBUT_____>
server.listen(PORT, () => {
  console.log(`Web Server start on port ${PORT}`); //<--Info Server
}); //DEMARRER_SERVER___FIN_______<
// ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
