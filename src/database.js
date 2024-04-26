const mongoose  = require("mongoose");
const configObjetc = require("./config/config.js");
const {mongo_url} = configObjetc;

mongoose.connect(mongo_url)
    .then(() => console.log("conexion exitosa"))
    .catch(()=> console.log("error"))

