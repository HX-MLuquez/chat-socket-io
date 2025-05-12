const express = require("express");
const path = require("path");
const configureHandlebars = require("./config/handlebars.config.js");

const app = express();

//* Configuración del motor de plantillas
configureHandlebars(app);

//* Archivos estáticos y middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 



//* Rutas
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;


