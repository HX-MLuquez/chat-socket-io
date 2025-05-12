const exphbs = require("express-handlebars");
const path = require("path");

function configureHandlebars(app) {
  app.engine(
    "hbs",
    exphbs.engine({
      extname: ".hbs",
      defaultLayout: "main",
      partialsDir: path.join(__dirname, "..", "views", "partials"),
    })
  );

  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "..", "views"));
}

module.exports = configureHandlebars;
