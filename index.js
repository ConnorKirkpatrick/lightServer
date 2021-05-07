const path = require("path");
const app = require("express")();
const express = require("express")
const http = require("http").createServer(app);

app.use("/static", express.static(path.join(__dirname, "./static/")));

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/lightsPage.html");
});