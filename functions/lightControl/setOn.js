const setJSON = require("../JSON/setJSON");

function setOn(connection, io, sysData){
    connection.emitter.once("TURNED ON", () => {
        if (io != null) {
            io.sockets.emit("statusChange", "ON")
            sysData.status = 1
            setJSON(JSON.stringify(sysData))
        }
    })

    connection.sendMessage("ON")
    /*

            }
        }
        connection.getMessage().removeListener(listener)
    })

     */
}

module.exports = setOn