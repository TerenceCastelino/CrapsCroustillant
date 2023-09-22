require("dotenv").config(); //<-- Chargement des variables d'environnement(.env)

// ____________________________
// VARIABLE_ENV____DEBUT_______>

const { PORT } = process.env; //<--Utilisation du destructuring

// ____________________________
// VARIABLE_ENV____FIN_________<
// ____________________________
//IMPORT_______DEBUT__________>

const http = require("http");
const homeControllers = require("./controllers/home.constroller");

// ____________________________
//IMPORT_______FIN____________<
// ____________________________
//CREATION_SERVER____DEBUT____>

const server = http.createServer((req, res) => {
  console.log(`URL : ${req.url} / METHODE : ${req.method}`); //<--Info Requete

  //________ROUTING______DEBUT_________➡️
  // ______________/___________________
  if (req.url === "/") {
    // acceuil
    homeControllers.index(req, res);
    // _____________MENU____________________
  } else if (req.url === "/menu") {
    // menu
    homeControllers.menu(req, res);
    // _______________MENU/:ID__________________
  } else if (req.url === "/menu/:id") {
    // menuId
    homeControllers.plat(req, res);
    // _____________/INFO____________________
  } else if (req.url === "/info") {
    // info
    homeControllers.info(req, res);
    // ______________:COMMENTAIRE___________________
  } else if (req.url === "/commentaire" && req.method === "GET") {
    // commentaire
    homeControllers.messageGET(req, res);
    // ______________:COMMENTAIRE/ADD___________________
  } else if (req.url === "/commentaire/add" && req.method === "POST") {
    // ajouter commentaire
    homeControllers.messagePOST(req, res);
    // _________________________________
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Page non Trouver</h1>");
    // _________________________________
  }
});
//________ROUTING______FIN_________⬅️

// ____________________________
//CREATION_SERVER____FIN______<
// ____________________________
//DEMARRER_SERVER___DEBUT_____>

server.listen(PORT, () => {
  console.log(`Web Server start on port ${PORT}`); //<--Info Server
});

// ____________________________
//DEMARRER_SERVER___FIN_______<
