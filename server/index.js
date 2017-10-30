const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const gameRoute = require("./routes/gamedata.js");
const authRoute = require("./routes/auth.js");
const playerRoute = require("./routes/player");
const path = require("path");
const config = require("./config.js");



// app.use(express.static(path.resolve(__dirname, "client", "build")));
// app.get("/", (req, res) => {  
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
  
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  
app.use("/game", gameRoute);
app.use("/auth", authRoute);
app.use("/player", playerRoute);



mongoose.connect(config.db, () => {
    console.log("CONNECTED ON " + config.db);
    app.listen(config.port, () => {
        console.log("CONNECTED ON PORT " + config.port);
    });
});