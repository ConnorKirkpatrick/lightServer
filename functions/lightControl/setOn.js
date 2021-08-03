const setJSON = require("../JSON/setJSON");

function setOn(connection, io, sysData){
    connection.sendMessage("ON")
    connection.getMessage((msg) =>{
        if(msg.includes("RECIEVED ON")){
            if(io != null) {
                io.sockets.emit("statusChange", "ON")
                sysData.status = 1
                setJSON(JSON.stringify(sysData))
            }
        }
    })
}

module.exports = setOn