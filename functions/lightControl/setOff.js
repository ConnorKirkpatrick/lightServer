const setJSON = require("../JSON/setJSON");

function setOff(connection, io, sysData,level){
    if(!isNaN(parseInt(level))){
        connection.sendMessage("OFF")
        connection.getMessage((msg) => {
            if (msg.includes("RECIEVED OFF")) {
                if(io !== null) {
                    io.sockets.emit("statusChange", "OFF")
                    sysData.status = 0
                    setJSON(JSON.stringify(sysData))
                }
            }
        })
    }
}

module.exports = setOff