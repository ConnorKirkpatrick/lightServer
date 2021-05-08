const path = require("path");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const pug = require("pug")
app.set("view engine","pug")
app.set("views","./static/views")

const setTime = require("./functions/time/setTime.js")

let status = 0
let level = 120
let trigger = 100
let onTime = 20.35
let offTime = 23.30


let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.render('lightsPage',{status: "Status: Testing"})
    //res.sendFile(__dirname + "/static/webPages/lightsPage/lightsPage.html");
});


io.on("connection",(socket) => {
    setTime(socket)
    startTimer(socket)

    socket.on("toggle", () => {
        status = status ^ 1
        console.log(status)
        app.set('title',status)
        if(status){socket.emit("statusChange","ON")}
        else{socket.emit("statusChange","OFF")}
    })

    socket.on("newTrigger", (newTrigger) => {
        trigger = newTrigger
        socket.emit("setTrigger",trigger)
    })

    socket.on("newOnTime",(time) => {
        onTime = time
        socket.emit("setOnTime",(time))
    })

    socket.on("newOffTime",(time) => {
        offTime = time
        socket.emit("setOffTime",(time))
    })
})

function startTimer(socket){
    let timer = setInterval(() => {
        setTime(socket)
    }, 60000)
}
