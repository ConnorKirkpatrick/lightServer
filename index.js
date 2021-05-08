const path = require("path");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const pug = require("pug")
app.set("view engine","pug")
app.set("views","./static/views")

const fs = require("fs")

const getTime = require("./functions/time/getTime")
const setTime = require("./functions/time/setTime")
const getJSON = require("./functions/JSON/getJSON")
const setJSON = require("./functions/JSON/setJSON")


let sysData = getJSON()
let status = sysData.status
let level = 120
let trigger = sysData.trigger
let onTime = sysData.onTime
let offTime = sysData.offTime
let strStatus;
if(status === 1){strStatus = "ON"}
else{strStatus = "OFF"}



let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    let options = {
        status: "Status: " + strStatus,
        currentLevel: "Current Level: " + level,
        trigger: "Trigger @: " + trigger,
        time: "Current Time: " + getTime(),
        onTime: "On Time: " + onTime,
        offTime: "Off Time: " + offTime
    }
    res.render('lightsPage',options)
    //res.sendFile(__dirname + "/static/webPages/lightsPage/lightsPage.html");
});


io.on("connection",(socket) => {
    startTimer(socket)
    socket.on("toggle", () => {
        status = status ^ 1
        let sysData = getJSON()
        sysData.status = status
        setJSON(JSON.stringify(sysData))
        if(status){io.sockets.emit("statusChange","ON")}
        else{io.sockets.emit("statusChange","OFF")}
    })

    socket.on("newTrigger", (newTrigger) => {
        trigger = newTrigger
        let sysData = getJSON()
        sysData.trigger = trigger
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setTrigger",trigger)
    })

    socket.on("newOnTime",(time) => {
        onTime = time
        let sysData = getJSON()
        sysData.onTime = onTime
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOnTime",(time))
    })

    socket.on("newOffTime",(time) => {
        offTime = time
        let sysData = getJSON()
        sysData.offTime = offTime
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOffTime",(time))
    })
})

function startTimer(socket){
    let timer = setInterval(() => {
        setTime(socket)
    }, 60000)
}
