const getJSON = require("../JSON/getJSON");
const setJSON = require("../JSON/setJSON");
const getTime = require("../time/getTime");
const statusSwitcher = require("../statusSwitching/statusSwitcher")


function statusMonitor(io, connection) {
    if(connection.clientSocket.connected) {
        connection.emitter.once("newLevel", (level) => {
            let time = parseInt(getTime().replace(":", "."))
            let sysData = getJSON()
            level = parseInt(level)
            io.sockets.emit("setLevel", level)
            setJSON(JSON.stringify(sysData))
            statusSwitcher(connection, io, sysData, time)
        })
        connection.getLevel()
    }

}

module.exports = statusMonitor