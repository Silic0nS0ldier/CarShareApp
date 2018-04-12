const express = require("express");

// Initialise express application
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(8088);
