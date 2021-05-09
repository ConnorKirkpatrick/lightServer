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

const statusMonitor = require("./functions/statusMonitor/statusMonitor")

let sysData = getJSON()
let toggle = sysData.toggle
let status = sysData.status
let level = sysData.level
let trigger = sysData.trigger
let onTime = sysData.onTime
let offTime = sysData.offTime
let strStatus;
if(status === 1){strStatus = "ON"}
else{strStatus = "OFF"}
let ip = sysData.IP

let connector = new connection()

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
    if(status === 1){
        connector.sendMessage("ON")
    }
    else{
        connector.sendMessage("OFF")
    }
});

app.get("/settings", (req, res) => {
    let options = {
        setIP: "IP: " + getJSON().IP
    }
    res.render('lightsSettings',options)
});

statusMonitor(io,connector)
startTimer(io)

io.on("connection",(socket) => {
    socket.on("toggle", () => {
        toggle = toggle ^ 1
        let sysData = getJSON()

        sysData.toggle = toggle
        setJSON(JSON.stringify(sysData))
        if(toggle){
            connector.sendMessage("ON")
            statusMonitor(io, connector)
        }
        else{
            connector.sendMessage("OFF")
            statusMonitor(io, connector)
        }
    })

    socket.on("newTrigger", (newTrigger) => {
        trigger = newTrigger
        let sysData = getJSON()
        sysData.trigger = trigger
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setTrigger",trigger)
        statusMonitor(io, connector)
    })

    socket.on("newOnTime",(time) => {
        onTime = time
        let sysData = getJSON()
        sysData.onTime = onTime
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOnTime",(time))
        statusMonitor(io, connector)
    })

    socket.on("newOffTime",(time) => {
        offTime = time
        let sysData = getJSON()
        sysData.offTime = offTime
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOffTime",(time))
        statusMonitor(io, connector)
    })

    socket.on("newIP",(ip) => {
        console.log(ip)
        let sysData = getJSON()
        sysData.IP = ip
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setIP",(ip))
        statusMonitor(io, connector)
    })
})

function startTimer(io){

    let timer = setInterval(() => {
        setTime(io)
        statusMonitor(io, connector)
    }, 60000)
    return timer
}

//TODO: System always turns on upon page refresh, TOGGLE always goes on and then off.
//TODO: add toggle on/off/auto, adds blanket functionality
