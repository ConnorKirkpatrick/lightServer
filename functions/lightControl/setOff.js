const setJSON = require("../JSON/setJSON");

function setOff(connection, io, sysData){
    connection.emitter.once("TURNED OFF", () => {
        if(io != null) {
            io.sockets.emit("statusChange", "OFF")
            sysData.status = 0
            setJSON(JSON.stringify(sysData))
        }
    })
    connection.sendMessage("OFF")



/*
    let listener = connection.getMessage((msg) => {

        connection.getMessage().removeListener(listener)
    })

 */
}

module.exports = setOff