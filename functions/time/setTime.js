let getTime = require("./getTime")
function setTime(socket){
    socket.emit("Time",getTime())
}


module.exports = setTime