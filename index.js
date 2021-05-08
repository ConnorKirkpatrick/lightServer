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

const connection = require("./functions/sockets/connection")


let sysData = getJSON()
let status = sysData.status
let level = 120
let trigger = sysData.trigger
let onTime = sysData.onTime
let offTime = sysData.offTime
let strStatus;
if(status === 1){strStatus = "ON"}
else{strStatus = "OFF"}
let ip = sysData.IP

let connector = new connection()
connector.sendMessage("This is a test")
connector.getMesaage((data) =>{
    console.log("Data: " + data)
})


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
});

app.get("/settings", (req, res) => {
    let options = {
        setIP: "IP: " + getJSON().IP
    }
    res.render('lightsSettings',options)
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

    socket.on("newIP",(ip) => {
        console.log(ip)
        let sysData = getJSON()
        sysData.IP = ip
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setIP",(ip))

    })
})

function startTimer(socket){
    let timer = setInterval(() => {
        setTime(socket)
    }, 60000)
}
