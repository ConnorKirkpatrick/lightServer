const setOn = require("../lightControl/setOn")
const setOff = require("../lightControl/setOff")

function statusSwitcher(connection, io, sysData, time) {
    let Level = sysData.level
    let toggle = sysData.toggle
    let status = sysData.status
    let timeOn = sysData.onTime
    let timeOff = sysData.offTime
    let trigger = sysData.trigger

    timeOn = parseFloat(timeOn.replace(":", "."))
    timeOff = parseFloat(timeOff.replace(":", "."))

//3 operational modes; ON, OFF, AUTO
//if on, set status to ON and switch on the light
//if off, set status to OFF and switch off the light
//if auto, leave to the time and level functions

//ON
    if (toggle === 1 && status !== 1) {
        setOn(connection, io, sysData)
        return
    }

//OFF
    else if (toggle === 2 && status !== 0) {
        console.log("STANDARD OFF")
        setOff(connection, io, sysData)
        return
    }
//AUTO
    else if (toggle === 0) {
        //auto on
        if (status !== 1 && timeOn <= time && timeOff > time && trigger > Level) {
            setOn(connection, io, sysData)
            return
        }
        //auto off; time is too early
        else if (status === 1 && timeOn <= time) {
            console.log("EARLY OFF")
            setOff(connection, io, sysData)
            return
        }
        //auto off; time is too late
        else if (status === 1 && timeOff < time) {
            console.log("LATE OFF")
            setOff(connection, io, sysData)
            return
        }
        //auto off; light is not low enough
        else if (status === 1 && Level > trigger + 10) {
            console.log("LEVEL LOW OFF")
            setOff(connection, io, sysData)
            return
        }
    }
    return;
}

module.exports = statusSwitcher

