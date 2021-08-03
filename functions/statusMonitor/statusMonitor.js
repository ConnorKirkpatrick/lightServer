const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");
const setOn = require("../lightControl/setOn")
const setOff = require("../lightControl/setOff")

function statusMonitor(io, connection){
    let time = parseInt(getTime().replace(":","."))
    try {
        connection.getLevel((level) => {
            let sysData = getJSON()
            let toggle = sysData.toggle
            let status = sysData.status
            let timeOn = sysData.onTime
            let timeOff = sysData.offTime
            let trigger = sysData.trigger
            console.log("VALUE: "+level)

            level = parseInt(level)
            //ERROR caused here, message receives the int rather than text, thus sends another request, starting a loop
            if(isNaN(level)){
                //value is a text message
            }
            else {
                sysData.level = level
                io.sockets.emit("setLevel", level)
            }

            setJSON(JSON.stringify(sysData))

            timeOn = parseInt(timeOn.replace(":", "."))
            timeOff = parseInt(timeOff.replace(":", "."))

            //3 operational modes; ON, OFF, AUTO
            //if on, set status to ON and switch on the light
            //if off, set status to OFF and switch off the light
            //if auto, leave to the time and level functions

            //ON
            if (toggle === 1 && status !== 1 ) {
                setOn(connection, io, sysData)
                return
            }

            //OFF
            else if (toggle === 2 && status !== 0) {
                console.log("STANDARD OFF")
                setOff(connection,io,sysData,level)
                return
            }
            //AUTO
            else if (toggle === 0) {
                //auto on
                if (status !== 1 && timeOn <= time && timeOff > time && trigger > level) {
                    setOn(connection, io, sysData)
                    return
                }
                //auto off; time is too early
                else if (status === 1 && timeOn > time) {
                    console.log("EARLY OFF")
                    setOff(connection,io,sysData)
                    return
                }
                //auto off; time is too late
                else if (status === 1 && timeOff < time) {
                    console.log("LATE OFF")
                    setOff(connection,io,sysData)
                    return
                }
                //auto off; light is not low enough
                else if (status === 1 && level > trigger+10) {
                    console.log("LEVEL LOW OFF")
                    setOff(connection,io,sysData)
                    return
                }
            }
        })
    }
    catch (e){
        console.log(e);
        connection.connect()
        statusMonitor(io,connection)
    }
}
//TODO: Add a system to turn the light off outside the current day.




module.exports = statusMonitor

//Sending off when auto on makes flood