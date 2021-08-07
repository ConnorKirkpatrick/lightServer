const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");
const statusSwitcher = require("../statusSwitching/statusSwitcher")


function statusMonitor(io, connection) {
    let time = parseInt(getTime().replace(":", "."))

    let lListener = function levelListen(level) {
        let sysData = getJSON()
        console.log("LVL: " + level)
        level = parseInt(level)
        if (!isNaN(level)) {
            sysData.level = level
            io.sockets.emit("setLevel", level)
        }
        setJSON(JSON.stringify(sysData))
        statusSwitcher(connection,io,sysData, time)
        connection.removeListener('newLevel', lListener)
    }

    let mListener = function messageListener(msg) {
        return msg;
    }

    connection.emitter.addListener('newLevel', lListener)
}

//TODO: Add a system to turn the light off outside the current day.




module.exports = statusMonitor