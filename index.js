const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

const dbPass = process.env.DB_PASSWORD_FILE ? fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf-8') : process.env.DB_PASSWORD;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  dbPass,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  }
);

const Jeux = sequelize.define("Jeux", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nom: DataTypes.STRING,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await Jeux.sync();
    await Jeux.findOrCreate({
      where: { id: 1 },
      defaults: {
        nom: "Elden Ring",
      },
    });
    await Jeux.findOrCreate({
      where: { id: 2 },
      defaults: {
        nom: "Stellaris",
      },
    });
    await Jeux.findOrCreate({
      where: { id: 3 },
      defaults: {
        nom: "Superman 64",
      },
    });
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  Jeux.findAll().then(r => res.send(r));
});

app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});
