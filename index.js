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
const setOn = require("./functions/lightControl/setOn")
const setOff = require("./functions/lightControl/setOff")

const connection = require("./functions/sockets/connection")

const statusMonitor = require("./functions/statusMonitor/statusMonitor")

let sysData = getJSON()
let setting = sysData.toggle
let status = sysData.status
let level = sysData.level
let trigger = sysData.trigger
let onTime = sysData.onTime
let offTime = sysData.offTime
let ip = sysData.IP

let strStatus;
if(status === 1){strStatus = "ON"}
else{strStatus = "OFF"}
let strSetting;
if(setting === 0){strSetting = "AUTOMATIC"}
else if(setting === 1){strSetting = "ON"}
else if(setting === 2){strSetting = "OFF"}

let timer = null;

let reconnectID = null;
let connector = new connection()

process.on("uncaughtException", function(err) {
    console.log(err.message)
    reconnectID = setTimeout(function (){
        connector = new connection();
        reconnectID = null; //Clear the ID when the awaited process is run
        }, 60000)
})




let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    let options = {
        status: "Status: " + strStatus,
        setting: "Setting: " + strSetting,
        currentLevel: "Current Level: " + level,
        trigger: "Trigger @: " + trigger,
        time: "Current Time: " + getTime(),
        onTime: "On Time: " + onTime,
        offTime: "Off Time: " + offTime
    }
    res.render('lightsPage',options)
    if(status === 1){
        setOn(connector,null,null)
    }
    else if(status === 0){
        setOff(connector,null,null)
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
        console.log("Setting: " + setting)
        setting++
        if(setting > 2){setting = 0}
        let sysData = getJSON()
        sysData.toggle = setting
        setJSON(JSON.stringify(sysData))
        if(setting === 0){io.sockets.emit("settingChange","AUTOMATIC")}
        else if(setting === 1){io.sockets.emit("settingChange","ON")}
        else if(setting === 2){io.sockets.emit("settingChange","OFF")}
        statusMonitor(io, connector)
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

        clearTimeout(reconnectID)
        connector = new connection();

        statusMonitor(io, connector)
    })
})

async function startTimer(io){
    timer = setInterval(() => {
        setTime(io)
        statusMonitor(io, connector)
    }, 30000)
}

function newTimer(io){
    clearTimeout(timer)
    startTimer(io)
}

//TODO: Check auto function not turning system on
//TODO: fix memory leak; listeners added in status monitor need cleared if a new monitor is started
//TODO: AUTO START
//TODO: add web console for arduino
//TODO: add auto-reconnect for arduino if disconnected; Add heartbeat
//TODO: Connection status for the webpage
//TODO: add log system to log the light level every hour

