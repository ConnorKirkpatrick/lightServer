const path = require("path");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

let status = 0


let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/webPages/lightsPage/lightsPage.html");
});


io.on("connection",(socket) => {
    socket.on("toggle", () => {
        status = status ^ 1
        console.log(status)
        app.set('title',status)
        if(status){socket.emit("statusChange","ON");}
        else{socket.emit("statusChange","OFF");}
    })
})
