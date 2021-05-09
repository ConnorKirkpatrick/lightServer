const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");

function statusMonitor(io, connection){
    console.log("Running")
    let time = parseInt(getTime().replace(":","."))
    connection.getLevel((level) => {
        let sysData = getJSON()
        let toggle = sysData.toggle
        let status = sysData.status
        let timeOn = sysData.onTime
        let timeOff = sysData.offTime
        let trigger = sysData.trigger
        sysData.level = level
        setJSON(JSON.stringify(sysData))
        io.sockets.emit("setLevel", level)

        timeOn = parseInt(timeOn.replace(":","."))
        timeOff = parseInt(timeOff.replace(":","."))

        //if toggle is true, set light on
        //if toggle is false, but time is in params and level < trigger, turn on
        //when system turns on, set toggle to on, prevents flickering
        //once on, allow user to toggle off, sets it back to automatic
        console.log(toggle,status)
        //toggle on
        if(toggle === 1){
            connection.sendMessage("ON")
            sysData.status = 1
            setJSON(JSON.stringify(sysData))
            io.sockets.emit("statusChange","ON")
            console.log("TURNING ON")
            return
        }

        //toggle off
        if(toggle !== 1){
            //check params, else set off. Goes back to automatic mode
            //turning on
            if(toggle !== 1 && status !== 1 && timeOn <= time && timeOff > time && trigger > level){
                connection.sendMessage("ON")
                sysData.status = 1
                setJSON(JSON.stringify(sysData))
                console.log("TURNING ON")
                return
            }
            //turning off, time is too late
            if(status === 1 && timeOff <= time){
                connection.sendMessage("OFF")
                console.log("TURNING ON")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                io.sockets.emit("statusChange","OFF")
                return
            }
            //turning off, time is too early
            if(status === 1 && timeOn > time){
                connection.sendMessage("OFF")
                console.log("EARLY OFF")
                io.sockets.emit("statusChange","OFF")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                return
            }
            if(status === 1 && level > trigger){
                console.log("LEVEL OFF")
                connection.sendMessage("OFF")
                io.sockets.emit("statusChange","OFF")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                return
            }
        }


    })
}

module.exports = statusMonitor