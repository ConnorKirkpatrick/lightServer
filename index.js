const path = require("path");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const events = require("events");

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
const statusSwitcher = require("./functions/statusSwitching/statusSwitcher")
const addGraphPoints = require("./functions/addGraphPoint/addGraphPoint")

let connected = false;
let timer = null;

let setting = 0

let generalListener = new events.EventEmitter()
let times = []
let levels = []

let reconnectID = null;
let connector = new connection(generalListener)

process.on("uncaughtException", function(err) {
    if(err.name !== "TypeError"){
        //Name: Error
        //Error caused by failed connection to arduino
        console.log(err.message)
        reconnectID = setTimeout(function (){
            connector = new connection();
            reconnectID = null; //Clear the ID when the awaited process is run
        }, 60000)
    }
    else{
        console.log(err.message)
        console.log(err.stack)
        //do nothing, using an error to prevent undesirable listener behaviour
    }


})



let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    let sysData = getJSON()
    setting = sysData.toggle
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
        //statusMonitor(io, connector)
        statusSwitcher(connector, io, sysData, getTime())
    })

    socket.on("newTrigger", (newTrigger) => {
        let sysData = getJSON()
        sysData.trigger = newTrigger
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setTrigger",newTrigger)
        //statusMonitor(io, connector)
        statusSwitcher(connector, io, sysData, getTime())
    })

    socket.on("newOnTime",(time) => {
        let sysData = getJSON()
        sysData.onTime = time
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOnTime",(time))
        //statusMonitor(io, connector)
        statusSwitcher(connector, io, sysData, getTime())
    })

    socket.on("newOffTime",(time) => {
        let sysData = getJSON()
        sysData.offTime = time
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setOffTime",(time))
        //statusMonitor(io, connector)
        statusSwitcher(connector, io, sysData, getTime())
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

    socket.on("getChartData", () => {
        socket.emit("chartData",([times,levels]))
    })
})

generalListener.on("newChartData", (data) => {
    console.log("GOT NEW DATA: " + data)
    addGraphPoints(times,levels,data[0],data[1], io)
    console.log(times)
    console.log(levels)
})

generalListener.on("disconnected", () => {
    connected = false
})

generalListener.on("connected", () =>{
    connected = true
})


connector.clientSocket.on("connect", () => {
    connected = true
    setTime(io)
    statusMonitor(io, connector, generalListener)
    io.sockets.emit("chartData",([times,levels]))
})

async function startTimer(io){
    timer = setInterval(() => {
        setTime(io)
        if(connected){
            statusMonitor(io, connector, generalListener)
            io.sockets.emit("chartData",([times,levels]))
        }
        else{
            console.log("No connection")
            //delete the connection object, then make a new one
            connector = new connection(generalListener)
        }
    }, 45000)
}

//TODO: system connects, no data is sent? check connection item and messaging methods
//TODO: set chart max size
//TODO: Connection status for the webpage: 0 to -150, -150 is worse. Do 0-50, 51-100, 101-150. "Last updated @*** While ***

