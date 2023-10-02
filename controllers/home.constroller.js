const ejs = require("ejs");
const queryString = require("querystring");
const mssql = require("mssql");
const fs = require("fs");
const { createDbConnection } = require("../outil/db.utils");
const cheminRacine = `${require.main.path}/views/home/`;

// ____________________Function___________________________
const promiseRender = (nomFichier, objet, res, req) => {
  ejs
    .renderFile(`${cheminRacine}${nomFichier}`, objet)
    .then((pageRender) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pageRender);
    })
    .catch((error) => {
      console.error(error);
      res.writeHead(500);
      res.end();
    });
};
// ____________________Function___________________________
// ____________________Function__Images___________________
const promiseRenderImage = (nomFichier, objet, res, req, image) => {
  ejs
    .renderFile(`${cheminRacine}${nomFichier}`, objet, image)
    .then((pageRender) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pageRender);
    })
    .catch((error) => {
      console.error(error);
      res.writeHead(500);
      res.end();
    });
};

// ____________________Function__Images___________________
// ____________________Function___________________________
const imageToBase64 = (imagePath) => {
  const bitmap = fs.readFileSync(imagePath);

  return new Buffer.from(bitmap).toString("base64");
};
// ____________________Function___________________________

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
    const image = imageToBase64(`${cheminRacine}asset/image/CC.jpg`);
    //  / : Page d'accueil du resto (Nom, texte de présentation, images)
    promiseRenderImage("index.ejs", { message, image }, res, req);
  },
  menu: async (req, res) => {
    //recuperation des données depuis la db
    const db = await createDbConnection();
    const result = await db.query("select *from Plats");
    const message = result.recordset.map((row) => {
      return {
        id: row["ID"],
        plat: row["NomDuPlat"],
        breveDescription: row["BreveDescription"],
        prix: row["Prix"],
      };
    });
    promiseRender("menu.ejs", { message }, res, req);
  },

  plat: async (req, res, id) => {
    console.log("le plat" + id);

    const db = await createDbConnection();
    const result = await db.query(`select * from plats where id = '${id}'`);
    const message = result.recordset.map((row) => {
      return {
        id: row["ID"],
        plat: row["NomDuPlat"],
        breveDescription: row["Description"],
        allergenes: row["Allergenes"],
        prix: row["Prix"],
      };
    });
    promiseRender("menu.id.ejs", { message }, res, req);
  },

  info(req, res) {
    promiseRender("info.ejs", {}, res, req);
  },

  messageGET: async (req, res) => {
    const db = await createDbConnection();
    const result = await db.query("select *from Commentaires");
    const commentaire = result.recordset.map((row) => {
      return {
        prenom: row["Prenom"],
        nom: row["Nom"],
        note: row["Note"],
        email: row["Email"],
        message: row["Message"],
      };
    });
    promiseRender("commentaire.ejs", { commentaire }, res, req);
  },
  messagePOSTDisplay: async (req, res) => {
    try {
      promiseRender("addCommentaire.ejs", {}, res, req);
    } catch (error) {
      console.error(error);
      res.writeHead(404);
      res.end();
    }
  },
  messagePOST: async (req, res) => {
    //  /comment/add : Page qui permet à un client d'ajouter un commentaire

    //promiseRender("addCommentaire.ejs", {}, res, req);

    try {
      let body = "";
      req.on("data", (formData) => {
        body += formData.toString();
      });
      console.log(body);
      req.on("end", async () => {
        const data = queryString.parse(body);

        console.log(data);

        const db = await createDbConnection();
        const sqlQuery = new mssql.PreparedStatement(db);
        sqlQuery.input("prenom", mssql.NVarChar);
        sqlQuery.input("nom", mssql.NVarChar);
        sqlQuery.input("note", mssql.Int);
        sqlQuery.input("email", mssql.NVarChar);
        sqlQuery.input("message", mssql.NVarChar);

        await sqlQuery.prepare(
          "INSERT INTO [Commentaires](prenom,nom,note,email,message)VALUES(@prenom,@nom,@note,@email,@message)"
        );
        await sqlQuery.execute(data);
        res.writeHead(302, { location: "/commentaire" });
        res.end();
      });
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end();
    }
  },
};
module.exports = homeControllers;
