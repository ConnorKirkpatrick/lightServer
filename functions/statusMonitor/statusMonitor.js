const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");
const statusSwitcher = require("../statusSwitching/statusSwitcher")


function statusMonitor(io, connection, generalMonitor) {
    generalMonitor.emit("disconnected")
    connection.emitter.once("newLevel", (level) => {
        generalMonitor.emit("connected")
        let time = parseFloat(getTime().replace(":", "."))
        //generalMonitor.emit("newChartData", ([time, level]))
        if(time.toString().split(".")[1] === "3" || time.toString().split(".")[1] === undefined) {
            generalMonitor.emit("newChartData", ([time, level]))
        }

        let sysData = getJSON()
        level = parseInt(level)
        sysData.level = level
        io.sockets.emit("setLevel", level)
        setJSON(JSON.stringify(sysData))
        statusSwitcher(connection, io, sysData, time)
    })
    connection.getLevel()

}

module.exports = statusMonitor