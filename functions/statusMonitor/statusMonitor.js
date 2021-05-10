const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");

function statusMonitor(io, connection){
    console.log("Running")
    let time = parseInt(getTime().replace(":","."))
    connection.getLevel((level) => {
        console.log("Got level")
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

        //3 operational modes; ON, OFF, AUTO
        //if on, set status to ON and switch on the light
        //if off, set status to OFF and switch off the light
        //if auto, leave to the time and level functions
        console.log("Toggle: " + toggle)
        //ON
        if(toggle === 1){
            connection.sendMessage("ON")
            io.sockets.emit("statusChange","ON")
            sysData.status = 1
            setJSON(JSON.stringify(sysData))
            return
        }

        //OFF
        else if(toggle === 2){
            connection.sendMessage("OFF")
            io.sockets.emit("statusChange","OFF")
            sysData.status = 0
            setJSON(JSON.stringify(sysData))
            return
        }
        //AUTO
        else if(toggle === 0){
            //auto on
            if(status !== 1 && timeOn <= time && timeOff > time && trigger > level){
                connection.sendMessage("ON")
                io.sockets.emit("statusChange","ON")
                sysData.status = 1
                setJSON(JSON.stringify(sysData))
                return
            }
            //auto off; time is too early
            else if(status === 1 && timeOn > time){
                console.log("EARLY OFF")
                connection.sendMessage("OFF")
                io.sockets.emit("statusChange","OFF")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                return
            }
            //auto off; time is too late
            else if(status === 1 && timeOff <= time){
                console.log("LATE OFF")
                connection.sendMessage("OFF")
                io.sockets.emit("statusChange","OFF")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                return
            }
            //auto off; light is not low enough
            else if(status === 1 && level > trigger){
                console.log("LEVEL LOW OFF")
                connection.sendMessage("OFF")
                io.sockets.emit("statusChange","OFF")
                sysData.status = 0
                setJSON(JSON.stringify(sysData))
                return
            }
        }
    })
}
//TODO: address flicker issue: light fluctuates by 5-10 points regularly. add a catch to keep the lights on once they are set

module.exports = statusMonitor