let getTime = require("./getTime")
function setTime(io){
    io.sockets.emit("Time",getTime())
}


module.exports = setTime